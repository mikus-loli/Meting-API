import store from '../admin/store.js'

export const authMiddleware = async (c, next) => {
    const username = c.req.header('X-Auth-Username')
    const token = c.req.header('X-Auth-Token')

    if (!username || !token) {
        return c.json({ success: false, error: '未提供认证信息' }, 401)
    }

    if (!store.validateToken(username, token)) {
        return c.json({ success: false, error: '认证信息无效或已过期' }, 401)
    }

    c.set('username', username)
    await next()
}

export const adminMiddleware = async (c, next) => {
    const username = c.get('username')
    const user = store.users.get(username)
    
    if (!user || user.role !== 'admin') {
        return c.json({ success: false, error: '权限不足' }, 403)
    }
    
    await next()
}

export const optionalAuth = async (c, next) => {
    const username = c.req.header('X-Auth-Username')
    const token = c.req.header('X-Auth-Token')

    if (username && token && store.validateToken(username, token)) {
        c.set('username', username)
    }
    
    await next()
}
