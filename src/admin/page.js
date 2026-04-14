const getAdminHtml = () => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meting-API 管理后台</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; min-height: 100vh; }
        .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .login-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .login-box h1 { text-align: center; margin-bottom: 30px; color: #333; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #666; font-size: 14px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #1890ff; }
        .btn { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.3s; }
        .btn-primary { background: #1890ff; color: white; width: 100%; }
        .btn-primary:hover { background: #40a9ff; }
        .btn-danger { background: #ff4d4f; color: white; }
        .btn-danger:hover { background: #ff7875; }
        .btn-default { background: #fff; border: 1px solid #d9d9d9; color: #333; }
        .btn-default:hover { border-color: #1890ff; color: #1890ff; }
        .btn-success { background: #52c41a; color: white; }
        .btn-success:hover { background: #73d13d; }
        .btn-sm { padding: 6px 12px; font-size: 12px; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-msg { color: #ff4d4f; font-size: 12px; margin-top: 10px; text-align: center; }
        .admin-container { display: none; }
        .sidebar { position: fixed; left: 0; top: 0; width: 200px; height: 100vh; background: #001529; color: white; padding-top: 20px; }
        .sidebar h2 { text-align: center; margin-bottom: 30px; font-size: 18px; }
        .sidebar-menu { list-style: none; }
        .sidebar-menu li { padding: 12px 20px; cursor: pointer; transition: all 0.3s; }
        .sidebar-menu li:hover, .sidebar-menu li.active { background: #1890ff; }
        .main-content { margin-left: 200px; padding: 20px; }
        .header { background: white; padding: 16px 24px; margin: -20px -20px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .header h3 { font-size: 18px; }
        .user-info { display: flex; align-items: center; gap: 16px; }
        .content-section { display: none; background: white; padding: 24px; border-radius: 8px; }
        .content-section.active { display: block; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #fafafa; font-weight: 500; }
        .table tr:hover { background: #fafafa; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .badge-success { background: #f6ffed; color: #52c41a; }
        .badge-warning { background: #fffbe6; color: #faad14; }
        .badge-info { background: #e6f7ff; color: #1890ff; }
        .badge-error { background: #fff2f0; color: #ff4d4f; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
        .modal.show { display: flex; }
        .modal-content { background: white; padding: 24px; border-radius: 8px; width: 100%; max-width: 500px; max-height: 80vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-header h3 { font-size: 18px; }
        .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
        .status-active { background: #52c41a; }
        .status-inactive { background: #d9d9d9; }
        .toast { position: fixed; top: 20px; right: 20px; padding: 12px 24px; border-radius: 4px; color: white; z-index: 2000; animation: slideIn 0.3s ease; }
        .toast-success { background: #52c41a; }
        .toast-error { background: #ff4d4f; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .cookie-preview { font-family: monospace; font-size: 12px; color: #666; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .actions { display: flex; gap: 4px; flex-wrap: wrap; }
        .empty-state { text-align: center; padding: 40px; color: #999; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 32px; font-weight: bold; color: #1890ff; }
        .stat-label { color: #666; margin-top: 8px; }
        .validation-status { display: flex; align-items: center; gap: 8px; }
        .user-info-tooltip { font-size: 12px; color: #666; margin-top: 4px; }
        .loading { display: inline-block; width: 12px; height: 12px; border: 2px solid #f3f3f3; border-top: 2px solid #1890ff; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .help-link { display: block; text-align: center; margin-top: 16px; color: #1890ff; font-size: 12px; cursor: pointer; }
        .help-link:hover { text-decoration: underline; }
        .help-content { display: none; margin-top: 16px; padding: 16px; background: #fafafa; border-radius: 4px; text-align: left; font-size: 12px; line-height: 1.8; }
        .help-content.show { display: block; }
        .help-content h4 { margin-bottom: 8px; color: #333; }
        .help-content ol { margin-left: 16px; color: #666; }
        .help-content code { background: #e6f7ff; padding: 2px 6px; border-radius: 2px; font-family: monospace; }
        .help-section { margin-bottom: 16px; }
    </style>
</head>
<body>
    <div class="login-container" id="loginContainer">
        <div class="login-box">
            <h1>🎵 Meting-API 管理后台</h1>
            <form id="loginForm">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="loginUsername" required placeholder="请输入用户名">
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" id="loginPassword" required placeholder="请输入密码">
                </div>
                <div class="error-msg" id="loginError"></div>
                <button type="submit" class="btn btn-primary">登录</button>
            </form>
            <p style="margin-top: 16px; text-align: center; color: #999; font-size: 12px;">默认账号: admin / admin123</p>
        </div>
    </div>

    <div class="admin-container" id="adminContainer">
        <div class="sidebar">
            <h2>🎵 管理后台</h2>
            <ul class="sidebar-menu">
                <li class="active" data-section="dashboard">📊 仪表盘</li>
                <li data-section="cookies">🍪 Cookie管理</li>
                <li data-section="monitor">🔔 Cookie监测</li>
                <li data-section="users">👥 用户管理</li>
                <li data-section="logs">📋 操作日志</li>
                <li data-section="settings">⚙️ 设置</li>
            </ul>
        </div>
        <div class="main-content">
            <div class="header">
                <h3 id="pageTitle">仪表盘</h3>
                <div class="user-info">
                    <span id="currentUser"></span>
                    <button class="btn btn-default btn-sm" onclick="logout()">退出登录</button>
                </div>
            </div>

            <div class="content-section active" id="dashboardSection">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="totalCookies">0</div>
                        <div class="stat-label">Cookie总数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="validCookies">0</div>
                        <div class="stat-label">有效Cookie</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="totalUsers">0</div>
                        <div class="stat-label">用户总数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="totalLogs">0</div>
                        <div class="stat-label">操作记录</div>
                    </div>
                </div>
                <h4 style="margin-bottom: 16px;">最近操作</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>操作</th>
                            <th>详情</th>
                            <th>操作人</th>
                        </tr>
                    </thead>
                    <tbody id="recentLogs"></tbody>
                </table>
            </div>

            <div class="content-section" id="cookiesSection">
                <div class="section-header">
                    <h4>Cookie列表</h4>
                    <button class="btn btn-primary btn-sm" onclick="showAddCookieModal()">添加Cookie</button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>平台</th>
                            <th>Cookie预览</th>
                            <th>备注</th>
                            <th>验证状态</th>
                            <th>启用</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="cookiesList"></tbody>
                </table>
            </div>

            <div class="content-section" id="monitorSection">
                <div class="section-header">
                    <h4>监测状态</h4>
                    <button class="btn btn-primary btn-sm" onclick="checkNow()">立即检查</button>
                </div>
                <div class="stats-grid" style="margin-bottom: 24px;">
                    <div class="stat-card">
                        <div class="stat-value" id="monitorStatus">-</div>
                        <div class="stat-label">监测状态</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="monitorInterval">-</div>
                        <div class="stat-label">检查间隔(分钟)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="monitorCheckCount">0</div>
                        <div class="stat-label">检查次数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="monitorLastCheck">-</div>
                        <div class="stat-label">上次检查</div>
                    </div>
                </div>
                
                <h4 style="margin-bottom: 16px;">监测设置</h4>
                <form id="monitorForm" style="max-width: 400px; margin-bottom: 30px;">
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="monitorEnabled"> 启用定时监测
                        </label>
                    </div>
                    <div class="form-group">
                        <label>检查间隔（分钟）</label>
                        <input type="number" id="monitorIntervalInput" min="5" max="1440" value="60">
                        <small style="color: #999; display: block; margin-top: 4px;">最小5分钟，最大1440分钟(24小时)</small>
                    </div>
                    <button type="submit" class="btn btn-primary">保存设置</button>
                </form>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <h4 style="margin-bottom: 16px;">Webhook通知设置</h4>
                <form id="webhookForm" style="max-width: 400px; margin-bottom: 30px;">
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="webhookEnabled"> 启用Webhook通知
                        </label>
                    </div>
                    <div class="form-group">
                        <label>Webhook URL</label>
                        <input type="text" id="webhookUrl" placeholder="https://example.com/webhook">
                        <small style="color: #999; display: block; margin-top: 4px;">支持企业微信、钉钉、飞书等Webhook地址</small>
                    </div>
                    <div class="form-group">
                        <label>自定义Headers (JSON格式)</label>
                        <textarea id="webhookHeaders" rows="3" placeholder='{"Authorization": "Bearer xxx"}'></textarea>
                        <small style="color: #999; display: block; margin-top: 4px;">可选，用于添加认证等自定义请求头</small>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button type="submit" class="btn btn-primary">保存Webhook</button>
                        <button type="button" class="btn btn-default" onclick="testWebhook()">测试发送</button>
                    </div>
                </form>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <h4 style="margin-bottom: 16px;">监测历史</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>类型</th>
                            <th>详情</th>
                        </tr>
                    </thead>
                    <tbody id="monitorLogsList"></tbody>
                </table>
            </div>

            <div class="content-section" id="usersSection">
                <div class="section-header">
                    <h4>用户列表</h4>
                    <button class="btn btn-primary btn-sm" onclick="showAddUserModal()">添加用户</button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>角色</th>
                            <th>创建时间</th>
                            <th>最后登录</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="usersList"></tbody>
                </table>
            </div>

            <div class="content-section" id="logsSection">
                <div class="section-header">
                    <h4>操作日志</h4>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>操作类型</th>
                            <th>详情</th>
                            <th>操作人</th>
                        </tr>
                    </thead>
                    <tbody id="logsList"></tbody>
                </table>
            </div>

            <div class="content-section" id="settingsSection">
                <h4 style="margin-bottom: 20px;">个人设置</h4>
                <form id="profileForm" style="max-width: 400px; margin-bottom: 30px;">
                    <div class="form-group">
                        <label>当前用户名</label>
                        <input type="text" id="currentUsernameDisplay" disabled>
                    </div>
                    <div class="form-group">
                        <label>新用户名</label>
                        <input type="text" id="newUsername" placeholder="留空则不修改">
                    </div>
                    <button type="submit" class="btn btn-primary">修改用户名</button>
                </form>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <h4 style="margin-bottom: 20px;">修改密码</h4>
                <form id="changePasswordForm" style="max-width: 400px;">
                    <div class="form-group">
                        <label>旧密码</label>
                        <input type="password" id="oldPassword" required>
                    </div>
                    <div class="form-group">
                        <label>新密码</label>
                        <input type="password" id="newPassword" required>
                    </div>
                    <div class="form-group">
                        <label>确认新密码</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary">修改密码</button>
                </form>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" id="adminPathDivider">
                <div id="adminPathSection">
                    <h4 style="margin-bottom: 20px;">安全设置</h4>
                    <form id="adminPathForm" style="max-width: 400px;">
                        <div class="form-group">
                            <label>管理后台路径</label>
                            <input type="text" id="adminPathInput" placeholder="例如: secret-admin">
                            <small style="color: #999; display: block; margin-top: 4px;">修改后需要重启服务才能生效</small>
                        </div>
                        <button type="submit" class="btn btn-primary">保存路径</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="cookieModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="cookieModalTitle">添加Cookie</h3>
                <button class="modal-close" onclick="closeModal('cookieModal')">&times;</button>
            </div>
            <form id="cookieForm">
                <input type="hidden" id="cookieId">
                <div class="form-group">
                    <label>平台</label>
                    <select id="cookiePlatform" required>
                        <option value="netease">网易云音乐</option>
                        <option value="tencent">QQ音乐</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Cookie数据</label>
                    <textarea id="cookieData" rows="4" required placeholder="请粘贴Cookie数据"></textarea>
                </div>
                <div class="form-group">
                    <label>备注</label>
                    <input type="text" id="cookieNote" placeholder="可选备注信息">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="skipValidation"> 跳过在线验证（不推荐）
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="cookieActive" checked> 启用此Cookie
                    </label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" onclick="closeModal('cookieModal')">取消</button>
                    <button type="submit" class="btn btn-primary" id="cookieSubmitBtn">保存并验证</button>
                </div>
            </form>
            <span class="help-link" onclick="toggleCookieHelp()">❓ 如何获取Cookie？</span>
            <div class="help-content" id="cookieHelpContent">
                <div class="help-section">
                    <h4>网易云音乐 Cookie 获取方法：</h4>
                    <ol>
                        <li>登录 <a href="https://music.163.com" target="_blank">music.163.com</a></li>
                        <li>按 F12 打开开发者工具</li>
                        <li>切换到 Network（网络）标签</li>
                        <li>刷新页面，点击任意请求</li>
                        <li>在 Headers（请求头）中找到 Cookie</li>
                        <li>复制完整 Cookie 值（需包含 <code>MUSIC_U</code>）</li>
                    </ol>
                </div>
                <div class="help-section">
                    <h4>QQ音乐 Cookie 获取方法：</h4>
                    <ol>
                        <li>登录 <a href="https://y.qq.com" target="_blank">y.qq.com</a></li>
                        <li>按 F12 打开开发者工具</li>
                        <li>切换到 Application（应用）标签</li>
                        <li>在左侧 Cookies 下找到 y.qq.com</li>
                        <li>复制 <code>uin</code> 和 <code>qqmusic_key</code> 的值</li>
                        <li>格式：<code>uin=你的uin; qqmusic_key=你的key</code></li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="userModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="userModalTitle">添加用户</h3>
                <button class="modal-close" onclick="closeModal('userModal')">&times;</button>
            </div>
            <form id="userForm">
                <input type="hidden" id="editUsername">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="userUsername" required>
                </div>
                <div class="form-group" id="passwordGroup">
                    <label>密码</label>
                    <input type="password" id="userPassword">
                </div>
                <div class="form-group">
                    <label>角色</label>
                    <select id="userRole">
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" onclick="closeModal('userModal')">取消</button>
                    <button type="submit" class="btn btn-primary">保存</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let authToken = localStorage.getItem('authToken');
        let authUsername = localStorage.getItem('authUsername');

        const api = async (url, options = {}) => {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            if (authToken) {
                headers['X-Auth-Username'] = authUsername;
                headers['X-Auth-Token'] = authToken;
            }
            const res = await fetch(url, { ...options, headers });
            const data = await res.json();
            if (res.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUsername');
                showLogin();
                return null;
            }
            return data;
        };

        const showToast = (message, type = 'success') => {
            const toast = document.createElement('div');
            toast.className = 'toast toast-' + type;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        };

        const formatDate = (timestamp) => {
            if (!timestamp) return '-';
            return new Date(timestamp).toLocaleString('zh-CN');
        };

        const getPlatformName = (platform) => {
            return platform === 'netease' ? '网易云音乐' : 'QQ音乐';
        };

        const getValidationBadge = (cookie) => {
            if (cookie.isValid === null || cookie.isValid === undefined) {
                return '<span class="badge badge-warning">未验证</span>';
            } else if (cookie.isValid) {
                let vipText = cookie.userInfo?.isVip ? ' (VIP)' : '';
                return '<span class="badge badge-success">有效' + vipText + '</span>';
            } else {
                return '<span class="badge badge-error">无效</span>';
            }
        };

        const toggleCookieHelp = () => {
            const el = document.getElementById('cookieHelpContent');
            el.classList.toggle('show');
        };

        const showLogin = () => {
            document.getElementById('loginContainer').style.display = 'flex';
            document.getElementById('adminContainer').style.display = 'none';
        };

        const showAdmin = () => {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('adminContainer').style.display = 'block';
            document.getElementById('currentUser').textContent = authUsername;
            document.getElementById('currentUsernameDisplay').value = authUsername;
            loadDashboard();
            loadConfig();
        };

        let currentUserRole = 'user';

        const loadConfig = async () => {
            const checkRes = await api('/admin/check');
            if (checkRes?.success) {
                currentUserRole = checkRes.data.role;
                if (currentUserRole !== 'admin') {
                    document.getElementById('adminPathDivider').style.display = 'none';
                    document.getElementById('adminPathSection').style.display = 'none';
                    return;
                }
            }
            
            const res = await api('/admin/config');
            if (res?.success && res.data?.adminPath) {
                document.getElementById('adminPathInput').value = res.data.adminPath;
            }
        };

        const logout = async () => {
            await api('/admin/logout', { method: 'POST' });
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUsername');
            showLogin();
        };

        const switchSection = (section) => {
            document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
            document.querySelector('[data-section="' + section + '"]').classList.add('active');
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(section + 'Section').classList.add('active');
            
            const titles = { dashboard: '仪表盘', cookies: 'Cookie管理', monitor: 'Cookie监测', users: '用户管理', logs: '操作日志', settings: '设置' };
            document.getElementById('pageTitle').textContent = titles[section];
            
            if (section === 'cookies') loadCookies();
            if (section === 'users') loadUsers();
            if (section === 'logs') loadLogs();
            if (section === 'monitor') loadMonitor();
        };

        const loadDashboard = async () => {
            const [cookiesRes, usersRes, logsRes] = await Promise.all([
                api('/admin/cookies'),
                api('/admin/users'),
                api('/admin/logs?limit=5')
            ]);
            
            if (cookiesRes?.success) {
                document.getElementById('totalCookies').textContent = cookiesRes.data.length;
                document.getElementById('validCookies').textContent = cookiesRes.data.filter(c => c.isValid === true).length;
            }
            if (usersRes?.success) {
                document.getElementById('totalUsers').textContent = usersRes.data.length;
            }
            if (logsRes?.success) {
                document.getElementById('totalLogs').textContent = logsRes.data.length;
                const tbody = document.getElementById('recentLogs');
                tbody.innerHTML = logsRes.data.slice(0, 5).map(log => '<tr><td>' + formatDate(log.timestamp) + '</td><td>' + log.action + '</td><td>' + log.details + '</td><td>' + log.username + '</td></tr>').join('');
            }
        };

        const loadCookies = async () => {
            const res = await api('/admin/cookies');
            if (!res?.success) return;
            
            const tbody = document.getElementById('cookiesList');
            if (res.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无Cookie数据</td></tr>';
                return;
            }
            
            tbody.innerHTML = res.data.map(cookie => {
                let vipAbilityText = '';
                if (cookie.userInfo) {
                    if (cookie.userInfo.canPlayVip) {
                        vipAbilityText = '<span style="color:#52c41a;">✓ 可播放VIP音乐</span>';
                    } else {
                        vipAbilityText = '<span style="color:#ff4d4f;">✗ 不可播放VIP音乐</span>';
                    }
                }
                return '<tr>' +
                    '<td><span class="badge badge-info">' + getPlatformName(cookie.platform) + '</span></td>' +
                    '<td class="cookie-preview" title="' + (cookie.cookiePreview || '') + '">' + (cookie.cookiePreview || '-') + '</td>' +
                    '<td>' + (cookie.note || '-') + '</td>' +
                    '<td>' +
                        '<div class="validation-status">' + getValidationBadge(cookie) + '</div>' +
                        (vipAbilityText ? '<div class="user-info-tooltip">' + vipAbilityText + '</div>' : '') +
                        (cookie.validationError ? '<div style="color:#ff4d4f;font-size:11px;">' + cookie.validationError + '</div>' : '') +
                    '</td>' +
                    '<td>' + (cookie.isActive ? '<span class="status-dot status-active"></span>启用' : '<span class="status-dot status-inactive"></span>禁用') + '</td>' +
                    '<td>' + formatDate(cookie.createdAt) + '</td>' +
                    '<td class="actions">' +
                        '<button class="btn btn-success btn-sm" onclick="verifyCookie(\\'' + cookie.id + '\\')" title="验证">验证</button>' +
                        '<button class="btn btn-default btn-sm" onclick="editCookie(\\'' + cookie.id + '\\')" title="编辑">编辑</button>' +
                        '<button class="btn btn-danger btn-sm" onclick="deleteCookie(\\'' + cookie.id + '\\')" title="删除">删除</button>' +
                    '</td>' +
                '</tr>';
            }).join('');
        };

        const loadUsers = async () => {
            const res = await api('/admin/users');
            if (!res?.success) return;
            
            const tbody = document.getElementById('usersList');
            tbody.innerHTML = res.data.map(user => '<tr><td>' + user.username + '</td><td><span class="badge ' + (user.role === 'admin' ? 'badge-warning' : 'badge-success') + '">' + (user.role === 'admin' ? '管理员' : '普通用户') + '</span></td><td>' + formatDate(user.createdAt) + '</td><td>' + formatDate(user.lastLogin) + '</td><td class="actions"><button class="btn btn-default btn-sm" onclick="editUser(\\'' + user.username + '\\')">编辑</button>' + (user.username !== 'admin' ? '<button class="btn btn-danger btn-sm" onclick="deleteUser(\\'' + user.username + '\\')">删除</button>' : '') + '</td></tr>').join('');
        };

        const loadLogs = async () => {
            const res = await api('/admin/logs?limit=100');
            if (!res?.success) return;
            
            const tbody = document.getElementById('logsList');
            tbody.innerHTML = res.data.map(log => '<tr><td>' + formatDate(log.timestamp) + '</td><td>' + log.action + '</td><td>' + log.details + '</td><td>' + log.username + '</td></tr>').join('');
        };

        const loadMonitor = async () => {
            const [statusRes, configRes, webhookRes, logsRes] = await Promise.all([
                api('/admin/monitor/status'),
                api('/admin/monitor'),
                api('/admin/webhook'),
                api('/admin/monitor/logs?limit=50')
            ]);
            
            if (statusRes?.success) {
                const status = statusRes.data;
                document.getElementById('monitorStatus').textContent = status.isRunning ? '运行中' : '已停止';
                document.getElementById('monitorStatus').style.color = status.isRunning ? '#52c41a' : '#ff4d4f';
                document.getElementById('monitorCheckCount').textContent = status.checkCount || 0;
                document.getElementById('monitorLastCheck').textContent = status.lastCheckTime ? formatDate(status.lastCheckTime) : '-';
            }
            
            if (configRes?.success) {
                document.getElementById('monitorEnabled').checked = configRes.data.enabled;
                document.getElementById('monitorInterval').textContent = configRes.data.interval;
                document.getElementById('monitorIntervalInput').value = configRes.data.interval;
            }
            
            if (webhookRes?.success) {
                document.getElementById('webhookEnabled').checked = webhookRes.data.enabled;
                document.getElementById('webhookUrl').value = webhookRes.data.url || '';
                if (webhookRes.data.headers && Object.keys(webhookRes.data.headers).length > 0) {
                    document.getElementById('webhookHeaders').value = JSON.stringify(webhookRes.data.headers, null, 2);
                }
            }
            
            if (logsRes?.success) {
                const tbody = document.getElementById('monitorLogsList');
                if (logsRes.data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" class="empty-state">暂无监测记录</td></tr>';
                } else {
                    tbody.innerHTML = logsRes.data.map(log => {
                        let typeText = '';
                        let typeClass = '';
                        switch(log.type) {
                            case 'check_complete': typeText = '检查完成'; typeClass = 'badge-success'; break;
                            case 'check_error': typeText = '检查错误'; typeClass = 'badge-error'; break;
                            case 'cookie_invalid': typeText = 'Cookie失效'; typeClass = 'badge-error'; break;
                            case 'webhook_sent': typeText = '通知发送'; typeClass = log.success ? 'badge-success' : 'badge-error'; break;
                            case 'webhook_error': typeText = '通知失败'; typeClass = 'badge-error'; break;
                            default: typeText = log.type; typeClass = 'badge-info';
                        }
                        
                        let details = '';
                        if (log.type === 'check_complete') {
                            details = '检查了 ' + log.totalChecked + ' 个Cookie';
                        } else if (log.type === 'cookie_invalid') {
                            details = log.platformName + ': ' + (log.note || log.cookieId) + ' - ' + log.reason;
                        } else if (log.type === 'webhook_sent') {
                            details = '状态码: ' + log.statusCode;
                        } else if (log.error) {
                            details = log.error;
                        }
                        
                        return '<tr><td>' + formatDate(log.timestamp) + '</td><td><span class="badge ' + typeClass + '">' + typeText + '</span></td><td>' + details + '</td></tr>';
                    }).join('');
                }
            }
        };

        const checkNow = async () => {
            showToast('正在检查Cookie...', 'success');
            const res = await api('/admin/monitor/check', { method: 'POST' });
            if (res?.success) {
                showToast('检查完成');
                loadMonitor();
            } else {
                showToast(res?.error || '检查失败', 'error');
            }
        };

        const testWebhook = async () => {
            showToast('正在发送测试消息...', 'success');
            const res = await api('/admin/webhook/test', { method: 'POST' });
            if (res?.success) {
                showToast('测试消息已发送');
            } else {
                showToast(res?.error || '发送失败', 'error');
            }
        };

        const showAddCookieModal = () => {
            document.getElementById('cookieModalTitle').textContent = '添加Cookie';
            document.getElementById('cookieForm').reset();
            document.getElementById('cookieId').value = '';
            document.getElementById('cookieActive').checked = true;
            document.getElementById('skipValidation').checked = false;
            document.getElementById('cookieSubmitBtn').disabled = false;
            document.getElementById('cookieSubmitBtn').textContent = '保存并验证';
            document.getElementById('cookieHelpContent').classList.remove('show');
            document.getElementById('cookieModal').classList.add('show');
        };

        const editCookie = async (id) => {
            const res = await api('/admin/cookies/' + id);
            if (!res?.success) return;
            
            document.getElementById('cookieModalTitle').textContent = '编辑Cookie';
            document.getElementById('cookieId').value = res.data.id;
            document.getElementById('cookiePlatform').value = res.data.platform;
            document.getElementById('cookieNote').value = res.data.note || '';
            document.getElementById('cookieActive').checked = res.data.isActive;
            document.getElementById('skipValidation').checked = false;
            document.getElementById('cookieSubmitBtn').disabled = false;
            document.getElementById('cookieSubmitBtn').textContent = '保存';
            document.getElementById('cookieHelpContent').classList.remove('show');
            document.getElementById('cookieModal').classList.add('show');
        };

        const verifyCookie = async (id) => {
            showToast('正在验证Cookie...', 'success');
            const res = await api('/admin/cookies/' + id + '/verify', { method: 'POST' });
            if (res?.success) {
                if (res.data.isValid) {
                    let msg = 'Cookie验证有效';
                    if (res.data.userInfo?.canPlayVip !== undefined) {
                        msg += res.data.userInfo.canPlayVip ? ' - 可播放VIP音乐' : ' - 不可播放VIP音乐';
                    }
                    showToast(msg, 'success');
                } else {
                    showToast('Cookie验证失败: ' + (res.data.validationError || '无效'), 'error');
                }
                loadCookies();
                loadDashboard();
            } else {
                showToast(res?.error || '验证失败', 'error');
            }
        };

        const deleteCookie = async (id) => {
            if (!confirm('确定要删除这个Cookie吗？')) return;
            const res = await api('/admin/cookies/' + id, { method: 'DELETE' });
            if (res?.success) {
                showToast('Cookie已删除');
                loadCookies();
                loadDashboard();
            } else {
                showToast(res?.error || '删除失败', 'error');
            }
        };

        const showAddUserModal = () => {
            document.getElementById('userModalTitle').textContent = '添加用户';
            document.getElementById('userForm').reset();
            document.getElementById('editUsername').value = '';
            document.getElementById('userUsername').disabled = false;
            document.getElementById('passwordGroup').style.display = 'block';
            document.getElementById('userPassword').required = true;
            document.getElementById('userModal').classList.add('show');
        };

        const editUser = (username) => {
            document.getElementById('userModalTitle').textContent = '编辑用户';
            document.getElementById('editUsername').value = username;
            document.getElementById('userUsername').value = username;
            document.getElementById('userUsername').disabled = true;
            document.getElementById('passwordGroup').style.display = 'block';
            document.getElementById('userPassword').required = false;
            document.getElementById('userPassword').placeholder = '留空则不修改密码';
            document.getElementById('userModal').classList.add('show');
        };

        const deleteUser = async (username) => {
            if (!confirm('确定要删除用户 ' + username + ' 吗？')) return;
            const res = await api('/admin/users/' + username, { method: 'DELETE' });
            if (res?.success) {
                showToast('用户已删除');
                loadUsers();
            } else {
                showToast(res?.error || '删除失败', 'error');
            }
        };

        const closeModal = (id) => {
            document.getElementById(id).classList.remove('show');
        };

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            const res = await api('/admin/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            if (res?.success) {
                authToken = res.data.token;
                authUsername = res.data.username;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('authUsername', authUsername);
                showAdmin();
            } else {
                document.getElementById('loginError').textContent = res?.error || '登录失败';
            }
        });

        document.getElementById('cookieForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('cookieId').value;
            const skipValidation = document.getElementById('skipValidation').checked;
            const data = {
                platform: document.getElementById('cookiePlatform').value,
                cookie: document.getElementById('cookieData').value,
                note: document.getElementById('cookieNote').value,
                isActive: document.getElementById('cookieActive').checked,
                skipValidation: skipValidation
            };
            
            const submitBtn = document.getElementById('cookieSubmitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> 验证中...';
            
            let res;
            if (id) {
                res = await api('/admin/cookies/' + id, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
            } else {
                res = await api('/admin/cookies', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = id ? '保存' : '保存并验证';
            
            if (res?.success) {
                let msg = 'Cookie已保存';
                if (!skipValidation && res.data?.userInfo?.canPlayVip !== undefined) {
                    msg += res.data.userInfo.canPlayVip ? ' - 可播放VIP音乐' : ' - 不可播放VIP音乐';
                }
                showToast(msg, 'success');
                closeModal('cookieModal');
                loadCookies();
                loadDashboard();
            } else {
                showToast(res?.error || '保存失败', 'error');
            }
        });

        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editUsername = document.getElementById('editUsername').value;
            const data = {
                username: document.getElementById('userUsername').value,
                password: document.getElementById('userPassword').value,
                role: document.getElementById('userRole').value
            };
            
            let res;
            if (editUsername) {
                res = await api('/admin/users/' + editUsername, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
            } else {
                res = await api('/admin/users', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
            }
            
            if (res?.success) {
                showToast('用户已保存');
                closeModal('userModal');
                loadUsers();
            } else {
                showToast(res?.error || '保存失败', 'error');
            }
        });

        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('newUsername').value.trim();
            
            if (!newUsername) {
                showToast('请输入新用户名', 'error');
                return;
            }
            
            if (newUsername === authUsername) {
                showToast('新用户名与当前用户名相同', 'error');
                return;
            }
            
            const res = await api('/admin/profile', {
                method: 'PUT',
                body: JSON.stringify({ newUsername })
            });
            
            if (res?.success) {
                authUsername = newUsername;
                localStorage.setItem('authUsername', newUsername);
                document.getElementById('currentUser').textContent = newUsername;
                document.getElementById('currentUsernameDisplay').value = newUsername;
                document.getElementById('newUsername').value = '';
                showToast('用户名已修改');
            } else {
                showToast(res?.error || '修改失败', 'error');
            }
        });

        document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showToast('两次输入的密码不一致', 'error');
                return;
            }
            
            const res = await api('/admin/password', {
                method: 'PUT',
                body: JSON.stringify({ oldPassword, newPassword })
            });
            
            if (res?.success) {
                showToast('密码已修改');
                document.getElementById('changePasswordForm').reset();
            } else {
                showToast(res?.error || '修改失败', 'error');
            }
        });

        document.getElementById('adminPathForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const adminPath = document.getElementById('adminPathInput').value.trim();
            
            if (!adminPath) {
                showToast('请输入管理后台路径', 'error');
                return;
            }
            
            const res = await api('/admin/config/admin-path', {
                method: 'PUT',
                body: JSON.stringify({ adminPath })
            });
            
            if (res?.success) {
                showToast('管理后台路径已保存，重启服务后生效');
            } else {
                showToast(res?.error || '保存失败', 'error');
            }
        });

        document.getElementById('monitorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const enabled = document.getElementById('monitorEnabled').checked;
            const interval = parseInt(document.getElementById('monitorIntervalInput').value);
            
            const res = await api('/admin/monitor', {
                method: 'PUT',
                body: JSON.stringify({ enabled, interval })
            });
            
            if (res?.success) {
                showToast('监测设置已保存');
                loadMonitor();
            } else {
                showToast(res?.error || '保存失败', 'error');
            }
        });

        document.getElementById('webhookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const enabled = document.getElementById('webhookEnabled').checked;
            const url = document.getElementById('webhookUrl').value.trim();
            const headersStr = document.getElementById('webhookHeaders').value.trim();
            
            let headers = {};
            if (headersStr) {
                try {
                    headers = JSON.parse(headersStr);
                } catch {
                    showToast('Headers JSON格式无效', 'error');
                    return;
                }
            }
            
            const res = await api('/admin/webhook', {
                method: 'PUT',
                body: JSON.stringify({ enabled, url, headers })
            });
            
            if (res?.success) {
                showToast('Webhook设置已保存');
            } else {
                showToast(res?.error || '保存失败', 'error');
            }
        });

        document.querySelectorAll('.sidebar-menu li').forEach(li => {
            li.addEventListener('click', () => switchSection(li.dataset.section));
        });

        if (authToken && authUsername) {
            api('/admin/check').then(res => {
                if (res?.success) showAdmin();
                else showLogin();
            });
        } else {
            showLogin();
        }
    </script>
</body>
</html>`

export const adminPageHandler = (c) => {
    return c.html(getAdminHtml())
}
