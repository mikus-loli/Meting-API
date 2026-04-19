import example from "./example.js"

const platformNames = {
    netease: '网易云音乐',
    tencent: 'QQ音乐'
}

const typeNames = {
    playlist: '歌单',
    song: '单曲',
    artist: '歌手',
    search: '搜索',
    lrc: '歌词',
    pic: '封面',
    url: '链接'
}

const platformIcons = {
    netease: '🎶',
    tencent: '🎵'
}

let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meting-API 测试</title>
    <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
    <style>
        :root {
            --primary: #6366f1;
            --primary-bg: rgba(99,102,241,0.07);
            --success: #10b981;
            --success-bg: rgba(16,185,129,0.07);
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
        }
        .header {
            background: var(--bg-card);
            border-bottom: 1px solid var(--border);
            padding: 16px 0;
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .header-inner {
            max-width: 960px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .header h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
        .header-badge {
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
        .back-link {
            color: var(--primary);
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: var(--transition);
        }
        .back-link:hover { text-decoration: underline; }
        .container { max-width: 960px; margin: 0 auto; padding: 28px 24px; }
        .section-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-title .platform-icon { font-size: 20px; }
        .player-card {
            background: var(--bg-card);
            border-radius: var(--radius);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border);
            margin-bottom: 16px;
            overflow: hidden;
            transition: box-shadow var(--transition);
        }
        .player-card:hover { box-shadow: var(--shadow); }
        .player-label {
            padding: 14px 20px 0;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .player-label .type-badge {
            display: inline-flex;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            background: var(--primary-bg);
            color: var(--primary);
        }
        .player-wrap { padding: 12px 20px 20px; }
        .divider { margin: 32px 0 24px; border: none; border-top: 1px solid var(--border); }
        footer {
            text-align: center;
            padding: 24px;
            color: var(--text-muted);
            font-size: 13px;
        }
        footer a { color: var(--primary); text-decoration: none; }
        footer a:hover { text-decoration: underline; }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 2px var(--success-bg); } 50% { box-shadow: 0 0 0 5px rgba(16,185,129,0.1); } }
        @media (max-width: 768px) {
            .container { padding: 16px 14px; }
            .header-inner { padding: 0 14px; }
            .player-wrap { padding: 10px 14px 14px; }
            .player-label { padding: 12px 14px 0; font-size: 12px; }
            .section-title { font-size: 14px; margin-bottom: 12px; }
            .player-card { margin-bottom: 12px; }
        }
        @media (max-width: 480px) {
            .header h1 { font-size: 15px; }
            .header-badge { font-size: 11px; padding: 3px 8px; }
            .back-link { font-size: 12px; }
            .container { padding: 12px 10px; }
            .player-wrap { padding: 8px 10px 10px; }
            .player-label { padding: 10px 10px 0; }
            .type-badge { font-size: 10px; }
            footer { padding: 16px 12px; font-size: 12px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-inner">
            <div class="header-left">
                <h1>🧪 API 测试</h1>
                <span class="header-badge"><span class="status-dot"></span>在线</span>
            </div>
            <a class="back-link" href="/">← 返回首页</a>
        </div>
    </div>
    <div class="container">
        <script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
        <script>
            var meting_api = 'api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
        </script>
        <script src="https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js"></script>
`

Object.keys(example).map(provider => {
    const items = Object.keys(example[provider]).filter(type => example[provider][type].show)
    if (items.length === 0) return

    html += `
        <div class="section-title">
            <span class="platform-icon">${platformIcons[provider] || '🎵'}</span>
            ${platformNames[provider] || provider}
        </div>
`
    items.map(type => {
        html += `
        <div class="player-card">
            <div class="player-label">
                ${typeNames[type] || type}
                <span class="type-badge">${type}</span>
            </div>
            <div class="player-wrap">
                <meting-js server="${provider}" type="${type}" id="${example[provider][type].value}" list-folded=true />
            </div>
        </div>
`
    })

    html += `        <hr class="divider">\n`
})

html += `
    </div>
    <footer>Powered by <a href="https://github.com/mikus-loli/Meting-API" target="_blank">Meting-API</a></footer>
</body>
</html>
`

export const handler = (c) => {
    return c.html(html)
}
