# Meting-API

多平台音乐 API 服务，支持网易云音乐和 QQ 音乐，提供完整的 Cookie 管理、VIP 歌曲播放、自动续期和监测通知功能。

## 功能特性

- 双平台支持：网易云音乐、QQ 音乐
- Cookie 管理系统：增删改查、在线验证、VIP 播放能力检测
- QQ 音乐 Cookie 自动刷新：支持 musickey 和 refresh_token 两种续期方式
- Cookie 定时监测：可配置间隔自动检查，失效/VIP 丢失时自动通知
- Webhook 通知：兼容 Gotify、企业微信、钉钉、飞书等
- 2FA 双因素认证：TOTP 实现，兼容 Google Authenticator
- 用户与权限管理：多用户、角色区分、登录失败锁定
- 管理后台：功能完备的单页应用，响应式设计
- 多运行时部署：Node.js / Docker / Vercel / Cloudflare Workers
- Docker 多架构镜像：支持 amd64/arm64，自动 CI/CD 发布

## API 支持矩阵

| 类型 | 说明 | 网易云 (`netease`) | QQ音乐 (`tencent`) |
|------|------|:---:|:---:|
| `song` | 单曲信息 | ✅ | ✅ |
| `playlist` | 歌单 | ✅ | ✅ |
| `artist` | 歌手歌曲 | ✅ | ❌ |
| `search` | 搜索 | ✅ | ❌ |
| `url` | 播放链接 | ✅ | ✅ |
| `lrc` | 歌词 | ✅ | ✅ |
| `pic` | 封面图片 | ✅ | ✅ |

## 地区限制

### 部署在国外

| 客户端访问地区 | 国内 | 国外 |
|:---:|:---:|:---:|
| 网易云 | ✅ | ✅ |
| QQ音乐 | ✅¹ | ❌ |

### 部署在国内

| 客户端访问地区 | 国内 | 国外 |
|:---:|:---:|:---:|
| 网易云 | ✅ | ✅ |
| QQ音乐 | ✅ | ❌ |

¹ 使用 JSONP，需要替换前端插件：
- `https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js` → `https://cdn.jsdelivr.net/npm/@xizeyoupan/meting@latest/dist/Meting.min.js`
- `https://unpkg.com/meting@2.0.1/dist/Meting.min.js` → `https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js`

详见 [MetingJS](https://github.com/xizeyoupan/MetingJS)

## 快速开始

### 环境要求

- Node.js >= 18.0.0

### 手动部署

```bash
git clone https://github.com/mikus-loli/Meting-API.git
cd Meting-API
npm install
node node.js
```

部署成功后访问 `http://localhost:3000/test` 验证服务是否正常运行。

### Docker 部署

```bash
docker pull ghcr.io/mikus-loli/meting-api:latest
docker run -d --name meting -p 3000:3000 ghcr.io/mikus-loli/meting-api:latest
```

持久化数据：

```bash
docker run -d --name meting \
  -p 3000:3000 \
  -v ./data:/app/data \
  ghcr.io/mikus-loli/meting-api:latest
```

自定义端口和用户：

```bash
docker run -d --name meting \
  -p 8080:8080 \
  -e PORT=8080 \
  -e UID=1000 \
  -e GID=1000 \
  -v ./data:/app/data \
  ghcr.io/mikus-loli/meting-api:latest
```

### Vercel 部署

<a href="https://vercel.com/import/project?template=https://github.com/mikus-loli/Meting-API"><img src="https://vercel.com/button" height="36"></a>

点击按钮后按提示操作即可。Vercel 部署时 `OVERSEAS` 自动设为 `1`。

> **注意**：Vercel/Cloudflare Workers 运行时不支持管理后台功能（依赖文件系统），仅提供基础 API 服务。

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 服务监听端口 |
| `OVERSEAS` | `false` | 海外模式。Vercel/Cloudflare 运行时自动设为 `true` |
| `ADMIN_PATH` | `admin` | 管理后台路径。如设为 `secret-admin`，则后台地址为 `/secret-admin` |
| `DATA_DIR` | `./data` | 数据存储目录 |
| `UID` | `1010` | Docker 容器用户 UID |
| `GID` | `1010` | Docker 容器用户 GID |

## 使用方法

### 前端插件集成

在导入 [MetingJS](https://github.com/xizeyoupan/MetingJS) 前添加：

```html
<script>
var meting_api='http://your-domain/api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>
```

### API 请求示例

```
GET /api?server=netease&type=playlist&id=7326220405
GET /api?server=tencent&type=song&id=004Yi5BD3ksoAN
GET /api?server=netease&type=url&id=22704470
GET /api?server=tencent&type=lrc&id=004Yi5BD3ksoAN
```

### 响应格式

- `type=url`：以 `@` 开头返回纯文本，否则 302 重定向到音频 URL
- `type=pic`：302 重定向到图片 URL
- `type=lrc`：返回纯文本歌词（含翻译合并）
- 其他类型：返回 JSON 数组

## 管理后台

访问 `/{ADMIN_PATH}`（默认 `/admin`）进入管理后台。

默认账号密码：`admin` / `admin123`，**请登录后立即修改默认密码**。

### 功能模块

| 模块 | 功能 |
|------|------|
| 仪表盘 | Cookie 统计、有效 Cookie 数、用户数、操作记录 |
| Cookie 管理 | 增删改查、在线验证、QQ音乐刷新、获取教程 |
| Cookie 监测 | 定时检查、自动刷新、Webhook 通知、监测历史 |
| 用户管理 | 增删改查、角色分配（管理员专属） |
| 操作日志 | 所有操作记录查看 |
| 设置 | 个人资料、密码修改、后台路径修改、2FA 设置 |

### Cookie 获取方法

#### 网易云音乐

1. 登录 [music.163.com](https://music.163.com)
2. 按 F12 打开开发者工具
3. 切换到 Network 标签，刷新页面
4. 找到任意请求，复制请求头中的 Cookie 字段
5. 粘贴到管理后台的 Cookie 输入框

#### QQ音乐

1. 登录 [y.qq.com](https://y.qq.com)
2. 按 F12 打开开发者工具
3. 切换到 Application → Cookies → y.qq.com
4. 复制 `uin` 和 `qqmusic_key` 的值
5. 格式：`uin=你的uin; qqmusic_key=你的key`

> **提示**：QQ音乐的完整 Cookie（包含 `psrf_qqrefresh_token`）支持自动续期，建议复制所有字段。

### QQ音乐 Cookie 自动续期

系统支持 QQ音乐 Cookie 自动刷新，无需手动更新：

- **刷新方式**：优先使用 `refresh_token`，失败后回退到 `musickey`
- **触发条件**：Cookie 监测检测到 VIP 播放能力丢失时自动触发
- **手动刷新**：在 Cookie 管理页面点击「刷新」按钮
- **刷新后更新**：`qqmusic_key`、`qm_keyst`、`access_token`、`openid`、过期时间等字段

## Cookie 监测系统

### 功能

- 定时监测 Cookie 有效性（间隔 5 分钟 ~ 24 小时）
- 检测 VIP 播放能力丢失
- QQ音乐 Cookie 自动刷新续期
- Webhook 通知（Cookie 失效、VIP 丢失、刷新成功）

### 配置步骤

1. 登录管理后台 → Cookie 监测
2. 启用定时监测，设置检查间隔
3. 配置 Webhook 通知（可选）
4. 保存设置

### Webhook 消息格式

```json
{
  "title": "Cookie失效通知 - 网易云音乐",
  "message": "平台: 网易云音乐\n备注: VIP账号\n失效时间: 2024-01-15 18:30:00\n原因: Cookie已失效\n\n请及时更新Cookie以确保服务正常",
  "priority": 5
}
```

### 通知事件优先级

| 事件 | 优先级 |
|------|--------|
| Cookie 失效 | 5 |
| VIP 播放能力丢失 | 4 |
| Cookie 自动刷新成功 | 3 |

### 常用 Webhook 配置

#### Gotify（推荐）

1. 部署 Gotify 服务端
2. 创建应用，获取 Token
3. Webhook URL：`https://your-gotify-server/message?token=YOUR_TOKEN`

#### 企业微信

1. 群聊中添加机器人
2. 获取 Webhook 地址填入

#### 钉钉

1. 群聊中添加自定义机器人
2. 安全设置选择「自定义关键词」，添加「Cookie」
3. 获取 Webhook 地址填入

#### 飞书

1. 群聊中添加自定义机器人
2. 获取 Webhook 地址填入

### 自定义 Headers

如需添加认证头，在「自定义 Headers」中输入 JSON：

```json
{
  "Authorization": "Bearer your-token-here"
}
```

## 安全特性

| 特性 | 说明 |
|------|------|
| 登录失败锁定 | 连续 5 次失败后锁定 15 分钟 |
| 隐藏管理入口 | 通过 `ADMIN_PATH` 自定义后台路径 |
| 动态路径修改 | 管理员可在后台设置页面修改路径，重启生效 |
| 2FA 双因素认证 | TOTP 实现，兼容 Google Authenticator / Authy |
| 非 root 运行 | Docker 容器以 `meting` 用户运行 |

## 管理 API

### 认证

所有管理 API 需在请求头中携带认证信息：

```
X-Auth-Username: your-username
X-Auth-Token: your-token
```

### 端点列表

#### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/admin/login` | 登录（支持 2FA） |
| POST | `/admin/logout` | 登出 |
| GET | `/admin/check` | 检查登录状态 |

#### Cookie 管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/cookies` | Cookie 列表（支持 `?platform=` 筛选） |
| GET | `/admin/cookies/:id` | Cookie 详情 |
| POST | `/admin/cookies` | 添加 Cookie |
| PUT | `/admin/cookies/:id` | 更新 Cookie |
| DELETE | `/admin/cookies/:id` | 删除 Cookie |
| POST | `/admin/cookies/:id/verify` | 验证 Cookie |
| POST | `/admin/cookies/:id/refresh` | 刷新 QQ 音乐 Cookie |
| POST | `/admin/cookies/validate` | 在线验证（不保存） |

#### 用户管理（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/users` | 用户列表 |
| POST | `/admin/users` | 添加用户 |
| PUT | `/admin/users/:username` | 更新用户 |
| DELETE | `/admin/users/:username` | 删除用户 |
| PUT | `/admin/profile` | 修改当前用户资料 |
| PUT | `/admin/password` | 修改当前用户密码 |

#### Cookie 监测（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/monitor` | 监测配置 |
| PUT | `/admin/monitor` | 更新监测配置 |
| GET | `/admin/monitor/status` | 运行状态 |
| POST | `/admin/monitor/check` | 立即检查 |
| GET | `/admin/monitor/logs` | 监测日志 |

#### Webhook（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/webhook` | Webhook 配置 |
| PUT | `/admin/webhook` | 更新配置 |
| POST | `/admin/webhook/test` | 测试发送 |

#### 2FA

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/2fa/status` | 2FA 状态 |
| POST | `/admin/2fa/setup` | 初始化设置 |
| POST | `/admin/2fa/enable` | 启用 2FA |
| POST | `/admin/2fa/disable` | 禁用 2FA |

#### 其他

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/logs` | 操作日志 |
| GET | `/admin/config` | 系统配置（管理员） |
| PUT | `/admin/config/admin-path` | 修改后台路径（管理员） |

## 反向代理

### Nginx

```nginx
server {
    listen 8099;
    server_name localhost;

    location /meting/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header X-Forwarded-Host $scheme://$host:$server_port/meting;
    }
}
```

### Caddy

```
http://localhost:8099 {
    handle_path /meting* {
        reverse_proxy http://localhost:3000 {
            header_up X-Forwarded-Host {scheme}://{host}:{port}/meting
        }
    }
}
```

### SSL 配置

#### Nginx

```nginx
server {
    listen 8099 ssl;
    server_name localhost;

    ssl_certificate     ../server.crt;
    ssl_certificate_key ../server.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /meting/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header X-Forwarded-Host $scheme://$host:$server_port/meting;
    }
}
```

#### Caddy

```
https://localhost:8099 {
    tls ./server.crt ./server.key
    handle_path /meting* {
        reverse_proxy http://localhost:3000 {
            header_up X-Forwarded-Host {scheme}://{host}:{port}/meting
        }
    }
}
```

## 常见问题

### QQ音乐无法播放？

- 确认部署在国内服务器
- 确认添加了有效的 VIP Cookie
- 尝试使用包含 `psrf_qqrefresh_token` 的完整 Cookie 以支持自动续期

### Cookie 刷新失败？

- 检查 Cookie 是否已完全过期（超过 90 天）
- 尝试重新登录获取新 Cookie
- 确保 Cookie 中包含 `psrf_qqrefresh_token` 字段

### Docker 数据持久化？

使用 `-v` 挂载数据目录：

```bash
docker run -d -p 3000:3000 -v ./data:/app/data ghcr.io/mikus-loli/meting-api:latest
```

### 忘记管理后台路径？

检查 `DATA_DIR/config.json` 中的 `adminPath` 字段，或通过环境变量 `ADMIN_PATH` 重新指定。

## 相关项目

- [MetingJS](https://github.com/xizeyoupan/MetingJS) - 前端音乐播放插件
- [Hono](https://github.com/honojs/hono) - Web 框架
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) - 网易云音乐 API
- [QQMusicApi](https://github.com/jsososo/QQMusicApi) - QQ 音乐 API

## License

MIT
