# Meting-API

https://meting-api-omega.vercel.app/test

## Feature

- js实现
- 插件系统，易于编写新接口及音源
- 管理后台系统，支持Cookie管理和VIP歌曲播放

## 进度

|               | server参数名称 | 图片 | 歌词 | url | 单曲/song | 歌单/playlist | 歌手/artist | 搜索/search |
| ------------- | -------------- | ---- | ---- | --- | --------- | ------------- | ----------- |--------- |
| 网易云        | netease        | √    | √    | √   | √         | √             | √           |√         |
| qq音乐        | tencent        | √    | √    | √   | √         | √             | ×           |×         |

## 地区限制

### 部署在国外

| 客户端/浏览器访问地区 | 国内 | 国外 |
| --------------------- | ---- | ---- |
| 网易云                | √    | √    |
| qq音乐                | √¹   | ×    |


### 部署在国内

| 客户端/浏览器访问地区 | 国内 | 国外 |
| --------------------- | ---- | ---- |
| 网易云                | √    | √    |
| qq音乐                | √    | ×    |


¹使用jsonp，**需要替换前端插件**， https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js => https://cdn.jsdelivr.net/npm/@xizeyoupan/meting@latest/dist/Meting.min.js , or 
https://unpkg.com/meting@2.0.1/dist/Meting.min.js => https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js

More info https://github.com/xizeyoupan/MetingJS

## 管理后台

访问 `/admin` 进入管理后台，默认账号密码：`admin` / `admin123`

### 功能特性

- **Cookie管理**：添加、编辑、删除和查看网易云音乐/QQ音乐的Cookie
- **VIP歌曲支持**：通过添加VIP账号Cookie，解锁VIP歌曲播放权限
- **用户管理**：管理员可添加、编辑、删除用户账户
- **操作日志**：记录所有关键操作，便于审计追踪
- **权限控制**：区分管理员和普通用户权限

### Cookie获取方法

#### 网易云音乐
1. 登录网易云音乐网页版 (music.163.com)
2. 打开浏览器开发者工具 (F12)
3. 切换到 Network 标签
4. 刷新页面，找到任意请求
5. 在请求头中找到 Cookie 字段，复制完整内容
6. 粘贴到管理后台的 Cookie 输入框

#### QQ音乐
1. 登录QQ音乐网页版 (y.qq.com)
2. 打开浏览器开发者工具 (F12)
3. 切换到 Application 标签
4. 在 Cookies 下找到 y.qq.com
5. 复制 `uin` 和 `qqmusic_key` 的值
6. 格式：`uin=你的uin; qqmusic_key=你的key`

### API接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/login` | POST | 用户登录 |
| `/admin/logout` | POST | 用户登出 |
| `/admin/cookies` | GET | 获取Cookie列表 |
| `/admin/cookies` | POST | 添加Cookie |
| `/admin/cookies/:id` | PUT | 更新Cookie |
| `/admin/cookies/:id` | DELETE | 删除Cookie |
| `/admin/users` | GET | 获取用户列表 |
| `/admin/users` | POST | 添加用户 |
| `/admin/logs` | GET | 获取操作日志 |

## 参数配置
以下参数均由环境变量配置

- OVERSEAS
  用于判断是否部署于国外。设为1会启用qq音乐的jsonp返回，同时需要替换[前端插件](https://github.com/xizeyoupan/MetingJS)，能实现国内访问国外api服务解析qq音乐。部署在国内不用设置这个选项。当部署到vercel上时，此选项自动设为1。
- PORT
  api监听端口，也是docker需要映射的端口。默认3000
- ADMIN_PATH
  管理后台路径，用于隐藏管理后台入口。默认 `admin`。例如设置为 `secret-admin-2024`，则管理后台地址为 `/secret-admin-2024`
- UID
  用于docker，默认1010
- GID
  用于docker，默认1010
- DATA_DIR
  数据存储目录，默认 `./data`

## 安全特性

- **登录失败限制**：连续5次登录失败后，账户将被锁定15分钟
- **隐藏管理入口**：可通过 `ADMIN_PATH` 环境变量或管理后台设置自定义管理后台路径
- **动态路径修改**：管理员可在后台"设置"页面修改管理入口路径，修改后重启服务生效
- **首次登录建议**：请登录后立即修改默认密码

## Cookie监测系统

系统提供定时监测Cookie有效性的功能，当Cookie失效时可自动发送Webhook通知。

### 功能特性

- **定时监测**：可配置监测间隔（5分钟-24小时）
- **失效通知**：通过Webhook发送标准化通知消息
- **监测历史**：记录所有监测事件和通知发送记录
- **手动检查**：支持立即执行一次检查

### 配置步骤

1. 登录管理后台，进入"Cookie监测"页面
2. 在"监测设置"区域：
   - 勾选"启用定时监测"
   - 设置检查间隔（默认60分钟）
   - 点击"保存设置"
3. 在"Webhook通知设置"区域：
   - 勾选"启用Webhook通知"
   - 填写Webhook URL（支持企业微信、钉钉、飞书等）
   - 点击"测试发送"验证配置
   - 点击"保存Webhook"

### Webhook消息格式

```json
{
  "message": "平台: 网易云音乐\n备注: VIP账号\n失效时间: 2024-01-15 18:30:00\n原因: Cookie已失效\n\n请及时更新Cookie以确保服务正常",
  "title": "Cookie失效通知 - 网易云音乐",
  "priority": 5
}
```

### 自定义Headers

如需添加认证等自定义请求头，可在"自定义Headers"中输入JSON格式：

```json
{
  "Authorization": "Bearer your-token-here"
}
```

### 常用Webhook配置

#### Gotify（推荐）

Gotify 是一个开源的自托管消息推送服务。

1. 部署 Gotify 服务端
2. 在 Gotify 中创建应用，获取 Token
3. Webhook URL 填入：`https://your-gotify-server/message?token=YOUR_TOKEN`
4. 无需配置 Headers

消息格式完全兼容 Gotify API：
```json
{
  "title": "Cookie失效通知 - 网易云音乐",
  "message": "平台: 网易云音乐\n备注: VIP账号\n失效时间: 2024-01-15 18:30:00\n原因: Cookie已失效\n\n请及时更新Cookie以确保服务正常",
  "priority": 5
}
```

#### 企业微信

1. 在企业微信群中添加机器人
2. 获取Webhook地址
3. 直接填入Webhook URL即可

#### 钉钉

1. 在钉钉群中添加自定义机器人
2. 安全设置选择"自定义关键词"，添加"Cookie"
3. 获取Webhook地址填入

#### 飞书

1. 在飞书群中添加自定义机器人
2. 获取Webhook地址填入

## 部署

部署 Meting-API 需要基本的计算机编程常识，如果您在部署过程中遇到无法解决的问题请到 issues 向我们提问，我们会尽快给您答复。

如果部署成功，在你的域名后拼接上`/test`，理论上出现类似下图数据：

![](assets/test.png)

### 手动部署

需要克隆项目到本地，node版本>=18。

```
npm i
```

#### Node

`node node.js`

<details>

<summary>Deprecated</summary>

#### Deno

`deno run --allow-net --allow-env dist/deno.js`

或者直接下载action中的文件运行。

</details>

### Docker部署

运行下面的命令下载 Meting-API 镜像

```
docker pull intemd/meting-api:latest
```

然后运行 Meting-API 即可

```
docker run -d --name meting -p 3000:3000 intemd/meting-api:latest
```

### 部署到vercel

比较出名，提供的域名被阻断，使用自有域名后速度尚可。冷启动速度一般。

<a href="https://vercel.com/import/project?template=https://github.com/xizeyoupan/Meting-API"><img src="https://vercel.com/button" height="36"></a>

一直下一步即可。

<details>

<summary>Deprecated</summary>

### Deno Deploy

类似Cloudflare Workers，但提供的域名未被阻断，使用Deno为runtime。

fork本项目后新建一个[project](https://dash.deno.com/projects)，首先在设置中加一个Environment Variable，名称是OVERSEAS，值为1。接着link到你自己的项目，部署方式选action，Deno Deploy 的 project 的 name 需要与你自己的yml中设置的吻合。

```yml
        uses: denoland/deployctl@v1
        with:
          project: meting #这里要改成你的Deno Deploy的project的name
          entrypoint: deno.js
```

接着在actions/publish/run workflow中勾选Deno即可。

</details>

## 杂项

### 反向代理

使用用nginx，让请求 `http://localhost:8099/meting` 的流量全部转发到 `http://localhost:3000` ，不能这么写：

```
   server {
      listen       8099;
      server_name  localhost;

      location /meting/ {
         proxy_pass http://localhost:3000/;
      }
   }
```

正确写法：

- nginx

   ```
   server {
      listen       8099;
      server_name  localhost;

      location /meting/ {
         proxy_pass http://localhost:3000/;
         proxy_set_header X-Forwarded-Host $scheme://$host:$server_port/meting;
      }
   }
   ```

- caddy
  
  ```
   http://localhost:8099 {
         handle_path /meting* {
                  reverse_proxy http://localhost:3000 {
                        header_up X-Forwarded-Host {scheme}://{host}:{port}/meting
                  }
         }
   }
  ```

### SSL证书

在上面基础上改动即可。

- nginx
  ```
      server {
        listen       8099 ssl;
        server_name  localhost;

        ssl_certificate     ../server.crt;  # pem文件的路径
        ssl_certificate_key  ../server.key; # key文件的路径
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;

        location /meting/ {
            proxy_pass http://localhost:3000/;
            proxy_set_header X-Forwarded-Host $scheme://$host:$server_port/meting;
        }
      }
  ```

- caddy
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

## 使用

在导入[前端插件](https://github.com/xizeyoupan/MetingJS)前，加入

```
<script>
var meting_api='http://example.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>
```

比如

```
<script>
var meting_api='http://localhost:3000/api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>
```

即可。就这样吧，那我去看vtb了，88

### 相关项目

https://github.com/metowolf/MetingJS

https://github.com/metowolf/Meting-API

https://github.com/honojs/hono

https://github.com/honojs/node-server

https://github.com/camsong/fetch-jsonp

https://github.com/Binaryify/NeteaseCloudMusicApi

https://github.com/jsososo/QQMusicApi
