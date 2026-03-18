# ClawCrush Dashboard 优化报告

## 一、安全性修复 (高优先级)

### 1. API 响应泄露 Telegram Bot Token
**问题**: `GET /api/agents`、`GET /api/user`、`POST /api/agents` 返回的 agent 数据中包含 `telegramBotToken` 明文，前端可以在浏览器 DevTools 中直接看到用户的 bot token。

**修复**: 在所有 API 响应中过滤掉 `telegramBotToken` 字段，只返回安全字段。
- `app/api/agents/route.ts` — GET 和 POST 响应均已过滤
- `app/api/user/route.ts` — GET 响应已过滤

### 2. Stripe Webhook 签名验证可被绕过
**问题**: 当 `STRIPE_WEBHOOK_SECRET` 环境变量为空时，webhook 签名验证直接被跳过 (`if (WEBHOOK_SECRET) { ... }`)，任何人都可以伪造 Stripe webhook 事件，创建虚假订阅记录。

**修复**: 改为当 secret 未配置时直接拒绝请求并返回 500 错误，确保签名验证始终执行。
- `app/api/webhook/route.ts`

### 3. Checkout 接口无身份验证
**问题**: `POST /api/checkout` 不验证身份，`userId` 和 `email` 直接从请求 body 中取值。攻击者可以伪造任意 userId 创建 checkout session。

**修复**: 添加 `verifyAuth()` 身份验证，`userId` 和 `email` 从服务端 token 中获取，不再信任客户端传入的值。Dashboard 前端也同步更新，在调用 checkout 时传递 Authorization header。
- `app/api/checkout/route.ts`
- `app/dashboard/page.tsx`

## 二、数据一致性修复 (中优先级)

### 4. Bot Token 唯一性检查
**问题**: 创建 agent 时没有检查 bot token 是否已被其他 agent 使用。同一个 bot token 可能被多个用户注册，导致 Telegram bot 被多个 agent 争夺控制权。

**修复**: 在创建 agent 前查询 Firestore，检查该 token 是否已被 active/provisioning 状态的 agent 使用，如果是则返回 409 错误。
- `app/api/agents/route.ts`

### 5. Checkout 完成后用户匹配优先级
**问题**: `checkout.session.completed` webhook 处理中，通过 email 在 agents 集合中查找用户。如果用户使用不同 email 支付（比如 Google 账号 email 和 Stripe 支付 email 不同），会匹配失败，导致订阅记录中 `userId` 为空。

**修复**: 优先使用 checkout session metadata 中的 `userId`（创建 checkout 时由服务端设置，可靠），只有 metadata 中没有时才 fallback 到 email 查找。
- `app/api/webhook/route.ts`

### 6. 图片配额月度自动重置
**问题**: `imageUsed` 计数只增不减，没有按月重置机制。用户月初用完配额后，下个月仍然无法使用。

**修复**: 在 `image_used` webhook 处理中增加月度重置逻辑。每次收到事件时检查当前月份是否与上次重置月份不同，如果不同则重置计数器为 1。使用 `imageQuotaResetMonth` 字段记录上次重置月份（格式: `"2026-03"`）。
- `app/api/webhook/agent/route.ts`

## 三、代码质量修复 (低优先级)

### 7. Admin 权限判断不再依赖客户端硬编码
**问题**: `app/admin/page.tsx` 客户端硬编码了 `ADMIN_EMAILS = ["simple.shen@gmail.com"]`，与 `lib/firebase-admin.ts` 中的服务端定义重复。如果修改了服务端的 admin 列表但忘记同步客户端，会出现不一致。

**修复**: 删除客户端的 `ADMIN_EMAILS` 硬编码。改为先调用 `GET /api/user` 获取服务端返回的 `isAdmin` 字段，再决定是否加载 admin 数据。admin 权限的唯一真相来源变为服务端。
- `app/admin/page.tsx`

### 8. 删除重复的类型定义
**问题**: `lib/types.ts` 中的 `Boyfriend` 接口与 `lib/personas.ts` 中的 `Persona` 接口几乎相同（字段名、类型都一样），但 `Boyfriend` 没有在任何地方被导入使用。

**修复**: 删除 `lib/types.ts` 中的 `Boyfriend` 接口。`Persona`（定义在 `lib/personas.ts`）是唯一的人物类型定义。
- `lib/types.ts`

## 四、Firestore 字段变更汇总

| 字段 | 变更 | 说明 |
|------|------|------|
| `agents.telegramBotToken` | API 响应中不再返回 | 仅存储在 Firestore，不暴露给前端 |
| `agents.imageQuotaResetMonth` | 新增 | 格式 `"2026-03"`，用于月度配额重置判断 |

## 五、涉及文件清单

| 文件 | 修改项 |
|------|--------|
| `app/api/agents/route.ts` | Token 过滤、bot token 唯一性检查 |
| `app/api/user/route.ts` | Token 过滤 |
| `app/api/checkout/route.ts` | 添加身份验证 |
| `app/api/webhook/route.ts` | 强制签名验证、userId 匹配优先级 |
| `app/api/webhook/agent/route.ts` | 图片配额月度重置 |
| `app/dashboard/page.tsx` | checkout 请求带 auth header |
| `app/admin/page.tsx` | 从服务端获取 admin 状态 |
| `lib/types.ts` | 删除重复 Boyfriend 接口 |
