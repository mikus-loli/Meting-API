import api from './src/service/api.js'
import { handler } from './src/template.js'
import { adminPageHandler } from './src/admin/page.js'
import adminRoutes from './src/admin/api.js'
import store from './src/admin/store.js'
import cookieMonitor from './src/admin/cookie-monitor.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import config from './src/config.js'
import { get_runtime, get_url } from './src/util.js'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

adminRoutes(app)

const getAdminPath = () => {
    const storedPath = store.getAdminPath()
    return storedPath || config.ADMIN_PATH
}

app.use('*', async (c, next) => {
    const adminPath = getAdminPath()
    const path = c.req.path
    
    if (path === '/' + adminPath || path.startsWith('/' + adminPath + '/')) {
        return adminPageHandler(c)
    }
    
    await next()
})

app.get('/api', api)
app.get('/test', handler)
app.get('/', (c) => {
    const baseUrl = get_url(c)
    return c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meting-API</title>
    <style>
        :root {
            --primary: #6366f1;
            --primary-light: #818cf8;
            --primary-dark: #4f46e5;
            --primary-bg: rgba(99,102,241,0.07);
            --success: #10b981;
            --success-bg: rgba(16,185,129,0.07);
            --warning: #f59e0b;
            --warning-bg: rgba(245,158,11,0.07);
            --danger: #ef4444;
            --text: #1e293b;
            --text-secondary: #64748b;
            --text-muted: #94a3b8;
            --bg: #f1f5f9;
            --bg-card: #ffffff;
            --border: #e2e8f0;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
            --shadow: 0 2px 8px rgba(0,0,0,0.06);
            --shadow-md: 0 4px 12px rgba(0,0,0,0.07);
            --radius: 10px;
            --radius-sm: 6px;
            --radius-lg: 14px;
            --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            background: var(--bg);
            min-height: 100vh;
            color: var(--text);
            -webkit-font-smoothing: antialiased;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            background-size: 200% 200%;
            animation: gradientShift 8s ease infinite;
            width: 100%;
            padding: 80px 24px 64px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: rgba(255,255,255,0.06);
            border-radius: 50%;
            top: -200px;
            right: -100px;
            animation: float 6s ease-in-out infinite;
        }
        .hero::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255,255,255,0.04);
            border-radius: 50%;
            bottom: -100px;
            left: -80px;
            animation: float 8s ease-in-out infinite reverse;
        }
        .hero-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
        .hero-icon { font-size: 56px; margin-bottom: 16px; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1); }
        .hero h1 { font-size: 40px; font-weight: 800; color: #fff; letter-spacing: -1px; margin-bottom: 8px; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero p { font-size: 16px; color: rgba(255,255,255,0.8); font-weight: 500; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .badges { display: flex; justify-content: center; gap: 8px; margin-top: 20px; flex-wrap: wrap; animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .badges img { height: 22px; }
        .container { max-width: 960px; width: 100%; padding: 0 24px; margin-top: -32px; position: relative; z-index: 2; }
        .card {
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border);
            padding: 28px 32px;
            margin-bottom: 20px;
            animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.4s both;
        }
        .card-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }
        .info-item {
            padding: 14px 16px;
            background: var(--bg);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            transition: var(--transition);
        }
        .info-item:hover { border-color: var(--primary); background: var(--primary-bg); }
        .info-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: var(--text); word-break: break-all; }
        .info-value a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .info-value a:hover { text-decoration: underline; }
        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 12px;
        }
        .link-card {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 20px;
            background: var(--bg);
            border-radius: var(--radius);
            border: 1px solid var(--border);
            text-decoration: none;
            color: var(--text);
            transition: var(--transition);
        }
        .link-card:hover { border-color: var(--primary); background: var(--primary-bg); transform: translateY(-2px); box-shadow: var(--shadow); }
        .link-icon { font-size: 24px; flex-shrink: 0; }
        .link-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .link-title { font-size: 14px; font-weight: 700; color: var(--text); }
        .link-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .link-arrow { color: var(--text-muted); font-size: 14px; transition: var(--transition); }
        .link-card:hover .link-arrow { color: var(--primary); transform: translateX(3px); }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            background: var(--success-bg);
            color: var(--success);
        }
        .status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--success);
            animation: pulse 2s ease-in-out infinite;
        }
        footer {
            text-align: center;
            padding: 32px 24px;
            color: var(--text-muted);
            font-size: 13px;
        }
        footer a { color: var(--primary); text-decoration: none; }
        footer a:hover { text-decoration: underline; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 2px var(--success-bg); } 50% { box-shadow: 0 0 0 5px rgba(16,185,129,0.1); } }
        @media (max-width: 768px) {
            .hero { padding: 48px 20px 40px; }
            .hero h1 { font-size: 28px; letter-spacing: -0.5px; }
            .hero p { font-size: 14px; }
            .hero-icon { font-size: 42px; }
            .card { padding: 20px 18px; }
            .info-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .info-item { padding: 12px; }
            .links-grid { grid-template-columns: 1fr; }
            .param-table { font-size: 12px; }
            .param-table th, .param-table td { padding: 8px 10px; }
            .code-block { font-size: 12px; padding: 14px 16px; }
            .code-block pre { font-size: 12px; }
            .api-endpoint { padding: 10px 12px; flex-wrap: wrap; }
            .api-path { font-size: 12px; word-break: break-all; }
            .section-subtitle { font-size: 13px; }
            .support-grid { grid-template-columns: repeat(2, 1fr); }
            .container { margin-top: -24px; }
            .error-table { font-size: 12px; }
            .error-table th, .error-table td { padding: 8px 10px; }
            .tabs { flex-wrap: wrap; }
            .tab-btn { padding: 6px 12px; font-size: 11px; }
        }
        @media (max-width: 480px) {
            .hero { padding: 36px 16px 32px; }
            .hero h1 { font-size: 24px; }
            .hero p { font-size: 13px; }
            .hero-icon { font-size: 36px; }
            .badges img { height: 18px; }
            .card { padding: 16px 14px; margin-bottom: 14px; }
            .card-title { font-size: 14px; margin-bottom: 14px; }
            .info-grid { grid-template-columns: 1fr; }
            .info-label { font-size: 10px; }
            .info-value { font-size: 13px; }
            .link-card { padding: 12px 14px; }
            .link-icon { font-size: 20px; }
            .link-title { font-size: 13px; }
            .link-desc { font-size: 11px; }
            .param-table { font-size: 11px; display: block; overflow-x: auto; }
            .param-table th, .param-table td { padding: 6px 8px; }
            .code-block { padding: 12px; }
            .code-block pre { font-size: 11px; line-height: 1.5; }
            .code-label { font-size: 11px; }
            .support-grid { grid-template-columns: 1fr; }
            .support-item { padding: 8px 10px; font-size: 12px; }
            .container { padding: 0 14px; margin-top: -20px; }
            footer { padding: 20px 16px; font-size: 12px; }
            .api-method { font-size: 10px; padding: 2px 8px; }
            .api-path { font-size: 11px; }
        }
        .api-method {
            display: inline-flex;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .method-get { background: var(--success-bg); color: var(--success); }
        .api-path {
            font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
            margin-left: 8px;
        }
        .api-endpoint {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: var(--bg);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            margin-bottom: 20px;
        }
        .param-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        .param-table th {
            padding: 10px 14px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--border);
            background: transparent;
        }
        .param-table td {
            padding: 10px 14px;
            border-bottom: 1px solid var(--border);
            color: var(--text);
            vertical-align: top;
        }
        .param-table tbody tr:last-child td { border-bottom: none; }
        .param-name {
            font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
            font-size: 12px;
            font-weight: 600;
            color: var(--primary);
        }
        .param-type { font-size: 11px; color: var(--text-muted); font-weight: 600; }
        .param-required { font-size: 11px; font-weight: 700; color: var(--danger); }
        .param-optional { font-size: 11px; font-weight: 600; color: var(--text-muted); }
        .param-default { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: var(--text-secondary); }
        .code-block {
            position: relative;
            background: #1e293b;
            border-radius: var(--radius-sm);
            padding: 16px 20px;
            margin-bottom: 16px;
            overflow-x: auto;
        }
        .code-block pre {
            font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #e2e8f0;
            white-space: pre;
            margin: 0;
        }
        .code-block .copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 10px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 4px;
            color: #94a3b8;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            font-family: inherit;
        }
        .code-block .copy-btn:hover { background: rgba(255,255,255,0.2); color: #e2e8f0; }
        .code-block .copy-btn.copied { background: var(--success); color: #fff; border-color: var(--success); }
        .code-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-secondary);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .code-label .tag {
            display: inline-flex;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 700;
        }
        .tag-json { background: var(--success-bg); color: var(--success); }
        .tag-text { background: var(--primary-bg); color: var(--primary); }
        .tag-redirect { background: var(--warning-bg); color: var(--warning); }
        .section-subtitle {
            font-size: 14px;
            font-weight: 700;
            color: var(--text);
            margin: 24px 0 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .support-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 8px;
            margin-bottom: 20px;
        }
        .support-item {
            padding: 10px 14px;
            background: var(--bg);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .support-item .check { color: var(--success); font-weight: 700; }
        .support-item .cross { color: var(--text-muted); }
        .error-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .error-table th {
            padding: 10px 14px;
            text-align: left;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--border);
        }
        .error-table td {
            padding: 10px 14px;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
        }
        .error-table tbody tr:last-child td { border-bottom: none; }
        .error-code { font-family: 'SF Mono', 'Fira Code', monospace; font-weight: 700; }
        .error-400 { color: var(--warning); }
        .error-403 { color: var(--danger); }
        .tabs { display: flex; gap: 2px; margin-bottom: 16px; background: var(--bg); border-radius: var(--radius-sm); padding: 3px; border: 1px solid var(--border); }
        .tab-btn {
            padding: 7px 16px;
            border: none;
            background: transparent;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            transition: var(--transition);
            font-family: inherit;
        }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active { background: var(--bg-card); color: var(--primary); box-shadow: var(--shadow-sm); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="hero-content">
            <div class="hero-icon">🎵</div>
            <h1>Meting API</h1>
            <p>多平台音乐 API 服务</p>
            <div class="badges">
                <a href="https://github.com/mikus-loli/Meting-API" style="text-decoration:none;">
                    <img alt="Github" src="https://img.shields.io/badge/Github-Meting-green">
                    <img alt="Forks" src="https://img.shields.io/github/forks/mikus-loli/Meting-API">
                    <img alt="Stars" src="https://img.shields.io/github/stars/mikus-loli/Meting-API">
                </a>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="card">
            <div class="card-title">📊 服务状态 <span class="status-badge"><span class="status-dot"></span>运行中</span></div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">版本</div>
                    <div class="info-value">1.1.2</div>
                </div>
                <div class="info-item">
                    <div class="info-label">运行环境</div>
                    <div class="info-value">${get_runtime()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">内部端口</div>
                    <div class="info-value">${config.PORT}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">部署区域</div>
                    <div class="info-value">${config.OVERSEAS ? '海外' : '大陆'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">当前时间</div>
                    <div class="info-value">${new Date().toLocaleString('zh-CN')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">实际地址</div>
                    <div class="info-value"><a href="${baseUrl}">${baseUrl}</a></div>
                </div>
            </div>
        </div>
        <div class="card" style="animation-delay: 0.5s;">
            <div class="card-title">🔗 快速导航</div>
            <div class="links-grid">
                <a class="link-card" href="${baseUrl}test">
                    <span class="link-icon">🎶</span>
                    <span class="link-info">
                        <span class="link-title">测试页面</span>
                        <span class="link-desc">在线播放器功能测试</span>
                    </span>
                    <span class="link-arrow">→</span>
                </a>
                <a class="link-card" href="${baseUrl}api">
                    <span class="link-icon">⚡</span>
                    <span class="link-info">
                        <span class="link-title">API 接口</span>
                        <span class="link-desc">音乐数据 API 服务</span>
                    </span>
                    <span class="link-arrow">→</span>
                </a>
                <a class="link-card" href="https://github.com/mikus-loli/Meting-API" target="_blank">
                    <span class="link-icon">📖</span>
                    <span class="link-info">
                        <span class="link-title">项目文档</span>
                        <span class="link-desc">GitHub 仓库与使用说明</span>
                    </span>
                    <span class="link-arrow">→</span>
                </a>
            </div>
        </div>
        <div class="card">
            <div class="card-title">📖 API 接口文档</div>

            <div class="api-endpoint">
                <span class="api-method method-get">GET</span>
                <span class="api-path">/api</span>
            </div>

            <div class="section-subtitle">📋 请求参数</div>
            <table class="param-table">
                <thead>
                    <tr><th>参数名</th><th>类型</th><th>必填</th><th>默认值</th><th>说明</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="param-name">server</span></td>
                        <td><span class="param-type">string</span></td>
                        <td><span class="param-optional">否</span></td>
                        <td><span class="param-default">tencent</span></td>
                        <td>音乐平台，可选值：<code>netease</code>（网易云音乐）、<code>tencent</code>（QQ音乐）</td>
                    </tr>
                    <tr>
                        <td><span class="param-name">type</span></td>
                        <td><span class="param-type">string</span></td>
                        <td><span class="param-optional">否</span></td>
                        <td><span class="param-default">playlist</span></td>
                        <td>请求类型，可选值见下方支持矩阵</td>
                    </tr>
                    <tr>
                        <td><span class="param-name">id</span></td>
                        <td><span class="param-type">string</span></td>
                        <td><span class="param-optional">否</span></td>
                        <td><span class="param-default">7326220405</span></td>
                        <td>资源ID，如歌单ID、歌曲ID、歌手ID、搜索关键词等</td>
                    </tr>
                </tbody>
            </table>

            <div class="section-subtitle">🔢 类型支持矩阵</div>
            <table class="param-table">
                <thead>
                    <tr><th>type 值</th><th>说明</th><th>netease</th><th>tencent</th></tr>
                </thead>
                <tbody>
                    <tr><td><span class="param-name">song</span></td><td>单曲信息</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                    <tr><td><span class="param-name">playlist</span></td><td>歌单</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                    <tr><td><span class="param-name">artist</span></td><td>歌手歌曲</td><td><span class="check">✓</span></td><td><span class="cross">✗</span></td></tr>
                    <tr><td><span class="param-name">search</span></td><td>搜索</td><td><span class="check">✓</span></td><td><span class="cross">✗</span></td></tr>
                    <tr><td><span class="param-name">url</span></td><td>播放链接</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                    <tr><td><span class="param-name">lrc</span></td><td>歌词</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                    <tr><td><span class="param-name">pic</span></td><td>封面图片</td><td><span class="check">✓</span></td><td><span class="check">✓</span></td></tr>
                </tbody>
            </table>

            <div class="section-subtitle">📨 请求示例</div>
            <div class="code-label">请求URL <span class="tag tag-text">URL</span></div>
            <div class="code-block">
                <button class="copy-btn" onclick="copyCode(this)">复制</button>
                <pre>${baseUrl}api?server=netease&type=playlist&id=6907557348</pre>
            </div>

            <div class="section-subtitle">✅ 响应示例</div>
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab(event, 'tab-song')">song / playlist / artist / search</button>
                <button class="tab-btn" onclick="switchTab(event, 'tab-url')">url</button>
                <button class="tab-btn" onclick="switchTab(event, 'tab-lrc')">lrc</button>
                <button class="tab-btn" onclick="switchTab(event, 'tab-pic')">pic</button>
            </div>

            <div class="tab-content active" id="tab-song">
                <div class="code-label">成功响应 <span class="tag tag-json">JSON</span> <span style="color:var(--success);font-weight:700;">200</span></div>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    <pre>[
  {
    "name": "歌曲名称",
    "artist": "歌手名",
    "url": "https://example.com/api?server=netease&type=url&id=xxx",
    "pic": "https://example.com/api?server=netease&type=pic&id=xxx",
    "lrc": "https://example.com/api?server=netease&type=lrc&id=xxx",
    "id": "473403185"
  }
]</pre>
                </div>
            </div>

            <div class="tab-content" id="tab-url">
                <div class="code-label">成功响应 <span class="tag tag-redirect">302 Redirect</span></div>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    <pre>HTTP/1.1 302 Found
Location: https://music.example.com/song.mp3</pre>
                </div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:8px;">当 url 以 <code>@</code> 开头时，直接返回文本内容而非重定向</div>
            </div>

            <div class="tab-content" id="tab-lrc">
                <div class="code-label">成功响应 <span class="tag tag-text">Text</span> <span style="color:var(--success);font-weight:700;">200</span></div>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    <pre>[00:00.00] 作词 : 某某
[00:01.00] 作曲 : 某某
[00:10.50]第一行歌词
[00:15.30]第二行歌词</pre>
                </div>
            </div>

            <div class="tab-content" id="tab-pic">
                <div class="code-label">成功响应 <span class="tag tag-redirect">302 Redirect</span></div>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    <pre>HTTP/1.1 302 Found
Location: https://img.example.com/cover.jpg</pre>
                </div>
            </div>

            <div class="section-subtitle">❌ 错误响应</div>
            <table class="error-table">
                <thead>
                    <tr><th>状态码</th><th>说明</th><th>响应示例</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="error-code error-400">400</span></td>
                        <td>参数不合法（server 或 type 不在支持范围内）</td>
                        <td><code>{"status":400,"message":"server 参数不合法","param":{"server":"xxx","type":"song","id":"123"}}</code></td>
                    </tr>
                    <tr>
                        <td><span class="error-code error-403">403</span></td>
                        <td>无法获取播放链接（Cookie 无效或资源不可用）</td>
                        <td><code>{"error":"no url"}</code></td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
    <footer>Powered by <a href="https://github.com/mikus-loli/Meting-API" target="_blank">Meting-API</a></footer>
    <script>
    function copyCode(btn) {
        const pre = btn.parentElement.querySelector('pre');
        navigator.clipboard.writeText(pre.textContent).then(() => {
            btn.textContent = '已复制';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500);
        });
    }
    function switchTab(e, tabId) {
        e.target.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const card = e.target.closest('.card');
        card.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    }
    </script>
</body>
</html>`)
})

cookieMonitor.start()

export default app
