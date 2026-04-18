import store from '../admin/store.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { validateCookie } from './cookie-validator.js'
import cookieMonitor from './cookie-monitor.js'
import { refreshTencentCookie, refreshTencentCookieByRefreshToken } from '../providers/tencent/refresh.js'

const formatCookieForDisplay = (cookie) => {
    const { id, platform, note, createdAt, updatedAt, createdBy, isActive, isValid, validatedAt, userInfo, validationError } = cookie
    let cookiePreview = cookie.cookie
    if (cookiePreview.length > 50) {
        cookiePreview = cookiePreview.substring(0, 50) + '...'
    }
    return { id, platform, cookiePreview, note, createdAt, updatedAt, createdBy, isActive, isValid, validatedAt, userInfo, validationError }
}

export const adminRoutes = (app) => {
    app.post('/admin/login', async (c) => {
        const body = await c.req.json()
        const { username, password, code } = body
        
        if (!username || !password) {
            return c.json({ success: false, error: '用户名和密码不能为空' }, 400)
        }
        
        const result = await store.authenticateUser(username, password)
        
        if (result.success && result.require2FA) {
            if (!code) {
                return c.json({ 
                    success: true, 
                    require2FA: true, 
                    data: { username: result.data.username, role: result.data.role }
                })
            }
            const twoFAResult = await store.verify2FALogin(username, code)
        if (twoFAResult.success) {
            return c.json(twoFAResult)
        } else {
            return c.json(twoFAResult, 400)
        }
        }
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 401)
        }
    })

    app.post('/admin/logout', async (c) => {
        const username = c.req.header('X-Auth-Username')
        if (username) {
            await store.logoutUser(username)
        }
        return c.json({ success: true })
    })

    app.get('/admin/check', authMiddleware, async (c) => {
        const username = c.get('username')
        const user = store.users.get(username)
        return c.json({ 
            success: true, 
            data: { 
                username: user.username, 
                role: user.role 
            } 
        })
    })

    app.get('/admin/cookies', authMiddleware, async (c) => {
        const platform = c.req.query('platform')
        const cookies = store.getCookies(platform).map(formatCookieForDisplay)
        return c.json({ success: true, data: cookies })
    })

    app.get('/admin/cookies/:id', authMiddleware, async (c) => {
        const id = c.req.param('id')
        const cookie = store.getCookie(id)
        
        if (!cookie) {
            return c.json({ success: false, error: 'Cookie不存在' }, 404)
        }
        
        return c.json({ success: true, data: formatCookieForDisplay(cookie) })
    })

    app.post('/admin/cookies', authMiddleware, async (c) => {
        const body = await c.req.json()
        const { platform, cookie, note, skipValidation } = body
        const username = c.get('username')
        
        const result = await store.addCookie(platform, cookie, note, username, skipValidation)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.put('/admin/cookies/:id', authMiddleware, async (c) => {
        const id = c.req.param('id')
        const body = await c.req.json()
        const username = c.get('username')
        const { skipValidation, ...updates } = body
        
        const result = await store.updateCookie(id, updates, username, skipValidation)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.delete('/admin/cookies/:id', authMiddleware, async (c) => {
        const id = c.req.param('id')
        const username = c.get('username')
        
        const result = await store.deleteCookie(id, username)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 404)
        }
    })

    app.post('/admin/cookies/:id/verify', authMiddleware, async (c) => {
        const id = c.req.param('id')
        const username = c.get('username')
        
        const result = await store.verifyCookie(id, username)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 404)
        }
    })

    app.post('/admin/cookies/:id/refresh', authMiddleware, async (c) => {
        const id = c.req.param('id')
        const username = c.get('username')
        
        const cookie = store.getCookie(id)
        if (!cookie) {
            return c.json({ success: false, error: 'Cookie不存在' }, 404)
        }
        
        if (cookie.platform !== 'tencent') {
            return c.json({ success: false, error: '仅支持QQ音乐Cookie刷新' }, 400)
        }
        
        const refreshResult = await cookieMonitor.refreshTencentCookie(cookie)
        
        if (refreshResult.success) {
            return c.json({ 
                success: true, 
                message: 'Cookie刷新成功',
                data: { id: cookie.id }
            })
        } else {
            return c.json({ 
                success: false, 
                error: refreshResult.error || 'Cookie刷新失败' 
            }, 400)
        }
    })

    app.post('/admin/cookies/validate', authMiddleware, async (c) => {
        const body = await c.req.json()
        const { platform, cookie } = body
        
        if (!platform || !cookie) {
            return c.json({ success: false, error: '平台和Cookie数据不能为空' }, 400)
        }
        
        const result = await validateCookie(platform, cookie)
        return c.json({ success: true, data: result })
    })

    app.get('/admin/users', authMiddleware, adminMiddleware, async (c) => {
        const users = store.getUsers()
        return c.json({ success: true, data: users })
    })

    app.post('/admin/users', authMiddleware, adminMiddleware, async (c) => {
        const body = await c.req.json()
        const { username: newUsername, password, role } = body
        const operator = c.get('username')
        
        if (!newUsername || !password) {
            return c.json({ success: false, error: '用户名和密码不能为空' }, 400)
        }
        
        const result = await store.addUser({ username: newUsername, password, role }, operator)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.put('/admin/users/:username', authMiddleware, adminMiddleware, async (c) => {
        const targetUsername = c.req.param('username')
        const body = await c.req.json()
        const operator = c.get('username')
        
        const result = await store.updateUser(targetUsername, body, operator)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.put('/admin/profile', authMiddleware, async (c) => {
        const currentUsername = c.get('username')
        const body = await c.req.json()
        
        const result = await store.updateUser(currentUsername, body, currentUsername)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.delete('/admin/users/:username', authMiddleware, adminMiddleware, async (c) => {
        const targetUsername = c.req.param('username')
        const operator = c.get('username')
        
        const result = await store.deleteUser(targetUsername, operator)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.get('/admin/logs', authMiddleware, async (c) => {
        const limit = parseInt(c.req.query('limit') || '100')
        const offset = parseInt(c.req.query('offset') || '0')
        const logs = store.getLogs(limit, offset)
        return c.json({ success: true, data: logs })
    })

    app.put('/admin/password', authMiddleware, async (c) => {
        const body = await c.req.json()
        const { oldPassword, newPassword } = body
        const username = c.get('username')
        
        if (!oldPassword || !newPassword) {
            return c.json({ success: false, error: '旧密码和新密码不能为空' }, 400)
        }
        
        const user = store.users.get(username)
        if (user.password !== store.hashPassword(oldPassword)) {
            return c.json({ success: false, error: '旧密码错误' }, 400)
        }
        
        const result = await store.updateUser(username, { password: newPassword }, username)
        return c.json(result)
    })

    app.get('/admin/config', authMiddleware, adminMiddleware, async (c) => {
        const config = store.getConfig()
        return c.json({ success: true, data: config })
    })

    app.put('/admin/config/admin-path', authMiddleware, adminMiddleware, async (c) => {
        const body = await c.req.json()
        const { adminPath } = body
        const operator = c.get('username')
        
        const result = await store.setAdminPath(adminPath, operator)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.get('/admin/webhook', authMiddleware, adminMiddleware, async (c) => {
        const config = store.getWebhookConfig()
        return c.json({ success: true, data: config })
    })

    app.put('/admin/webhook', authMiddleware, adminMiddleware, async (c) => {
        const body = await c.req.json()
        const operator = c.get('username')
        
        const result = await store.setWebhookConfig(body, operator)
        
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.post('/admin/webhook/test', authMiddleware, adminMiddleware, async (c) => {
        const result = await cookieMonitor.testWebhook()
        
        if (result.sent) {
            return c.json({ success: true, message: 'Webhook测试消息已发送' })
        } else {
            return c.json({ success: false, error: result.error || '发送失败' }, 400)
        }
    })

    app.get('/admin/monitor', authMiddleware, adminMiddleware, async (c) => {
        const config = store.getMonitorConfig()
        return c.json({ success: true, data: config })
    })

    app.put('/admin/monitor', authMiddleware, adminMiddleware, async (c) => {
        const body = await c.req.json()
        const operator = c.get('username')
        
        const result = await store.setMonitorConfig(body, operator)
        
        if (result.success) {
            if (body.enabled !== undefined || body.interval !== undefined) {
                cookieMonitor.restart()
            }
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.get('/admin/monitor/status', authMiddleware, adminMiddleware, async (c) => {
        const status = cookieMonitor.getStatus()
        return c.json({ success: true, data: status })
    })

    app.post('/admin/monitor/check', authMiddleware, adminMiddleware, async (c) => {
        const result = await cookieMonitor.checkNow()
        
        if (result.success) {
            return c.json({ success: true, message: '检查已完成' })
        } else {
            return c.json(result, 400)
        }
    })

    app.get('/admin/monitor/logs', authMiddleware, adminMiddleware, async (c) => {
        const limit = parseInt(c.req.query('limit') || '100')
        const offset = parseInt(c.req.query('offset') || '0')
        const logs = store.getMonitorLogs(limit, offset)
        return c.json({ success: true, data: logs })
    })

    app.get('/admin/2fa/status', authMiddleware, async (c) => {
        const username = c.get('username')
        const status = store.get2FAStatus(username)
        return c.json({ success: true, data: status })
    })

    app.post('/admin/2fa/setup', authMiddleware, async (c) => {
        const username = c.get('username')
        const result = store.setup2FA(username)
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.post('/admin/2fa/enable', authMiddleware, async (c) => {
        const body = await c.req.json()
        const { code } = body
        const username = c.get('username')

        if (!code) {
            return c.json({ success: false, error: '验证码不能为空' }, 400)
        }

        const result = await store.enable2FA(username, code)
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })

    app.post('/admin/2fa/disable', authMiddleware, async (c) => {
        const body = await c.req.json()
        const { password } = body
        const username = c.get('username')

        if (!password) {
            return c.json({ success: false, error: '密码不能为空' }, 400)
        }

        const result = await store.disable2FA(username, password)
        if (result.success) {
            return c.json(result)
        } else {
            return c.json(result, 400)
        }
    })
}

export default adminRoutes
