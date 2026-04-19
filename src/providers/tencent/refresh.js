import crypto from 'crypto'

const parseCookieString = (cookieString) => {
    if (!cookieString) return {}
    const cookies = {}
    cookieString.split(';').forEach(item => {
        const [key, value] = item.trim().split('=')
        if (key && value) {
            cookies[key] = value
        }
    })
    return cookies
}

const buildRefreshResult = (loginData, uin) => {
    const updates = {
        qqmusic_key: loginData.musickey,
        qm_keyst: loginData.musickey
    }
    if (loginData.access_token) {
        updates.psrf_qqaccess_token = loginData.access_token
    }
    if (loginData.openid) {
        updates.psrf_qqopenid = loginData.openid
    }
    if (loginData.expired_at) {
        updates.psrf_access_token_expiresAt = String(loginData.expired_at)
    }
    if (loginData.musickeyCreateTime) {
        updates.psrf_musickey_createtime = String(loginData.musickeyCreateTime)
    }
    if (loginData.str_musicid) {
        updates.uin = loginData.str_musicid
    }

    const newCookie = Object.entries(updates)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ')

    return {
        success: true,
        cookie: newCookie,
        musickey: loginData.musickey,
        refreshToken: loginData.refresh_token || null,
        accessToken: loginData.access_token || null,
        expire: loginData.expired_at || null
    }
}

const refreshTencentCookie = async (cookieString) => {
    try {
        const cookie = parseCookieString(cookieString)
        const uin = cookie.uin || ''
        const qqmusic_key = cookie.qqmusic_key || cookie.qm_keyst || ''
        
        if (!uin || !qqmusic_key) {
            return {
                success: false,
                error: 'Cookie缺少必要的认证信息 (uin 或 qqmusic_key)'
            }
        }

        const data = {
            comm: {
                g_tk: 5381,
                uin: uin,
                format: 'json',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq.json',
                needNewCode: 0
            },
            req_0: {
                module: 'QQConnectLogin.LoginServer',
                method: 'QQLogin',
                param: {
                    expired_in: 7776000,
                    musicid: parseInt(uin),
                    musickey: qqmusic_key
                }
            }
        }

        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?data=' + encodeURIComponent(JSON.stringify(data))

        console.log('[QQMusic Refresh] Using musickey, uin:', uin)
        
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://y.qq.com/'
            }
        })
        const result = await res.json()
        
        console.log('[QQMusic Refresh] Response code:', result.req_0?.code, 'has musickey:', !!result.req_0?.data?.musickey)

        if (result.req_0 && result.req_0.data && result.req_0.data.musickey) {
            return buildRefreshResult(result.req_0.data, uin)
        }

        const errorMsg = result.req_0?.data?.errMsg || result.req_0?.code || JSON.stringify(result)
        return {
            success: false,
            error: `Cookie刷新失败: ${errorMsg}`
        }
    } catch (e) {
        console.error('[QQMusic Refresh] Error:', e)
        return {
            success: false,
            error: `刷新出错: ${e.message}`
        }
    }
}

const refreshTencentCookieByRefreshToken = async (refreshToken, uin) => {
    try {
        if (!refreshToken || !uin) {
            return {
                success: false,
                error: '缺少refresh_token或uin'
            }
        }

        const data = {
            comm: {
                g_tk: 5381,
                uin: uin,
                format: 'json',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq.json',
                needNewCode: 0
            },
            req_0: {
                module: 'QQConnectLogin.LoginServer',
                method: 'QQLogin',
                param: {
                    expired_in: 7776000,
                    musicid: parseInt(uin),
                    refresh_token: refreshToken
                }
            }
        }

        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?data=' + encodeURIComponent(JSON.stringify(data))

        console.log('[QQMusic Refresh] Using refresh_token, uin:', uin)

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://y.qq.com/'
            }
        })
        const result = await res.json()

        console.log('[QQMusic Refresh] Response code:', result.req_0?.code, 'has musickey:', !!result.req_0?.data?.musickey)

        if (result.req_0 && result.req_0.data && result.req_0.data.musickey) {
            const refreshResult = buildRefreshResult(result.req_0.data, uin)
            if (!refreshResult.refreshToken && refreshToken) {
                refreshResult.refreshToken = refreshToken
            }
            return refreshResult
        }

        const errorMsg = result.req_0?.data?.errMsg || result.req_0?.code || JSON.stringify(result)
        return {
            success: false,
            error: `refresh_token刷新失败: ${errorMsg}`
        }
    } catch (e) {
        console.error('[QQMusic Refresh] Error:', e)
        return {
            success: false,
            error: `刷新出错: ${e.message}`
        }
    }
}

export {
    refreshTencentCookie,
    refreshTencentCookieByRefreshToken
}

export default {
    refreshTencentCookie,
    refreshTencentCookieByRefreshToken
}
