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

const getSign = (data) => {
    let str = data
    if (typeof data === 'object') {
        str = JSON.stringify(data)
    }
    const hash = crypto.createHash('md5').update(str).digest('hex')
    return 'zzb' + hash.slice(21, 22) + hash.slice(4, 5) + hash.slice(9, 10) + hash.slice(26, 27) + hash.slice(16, 17) + hash.slice(20, 21) + hash.slice(27, 28) + hash.slice(30, 31) +
        hash.slice(18, 19) + hash.slice(11, 12) + hash.slice(3, 4) + hash.slice(2, 3) + hash.slice(1, 2) + hash.slice(7, 8) + hash.slice(6, 7) + hash.slice(25, 26)
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

        console.log('[QQMusic Refresh] Using musicu.fcg API')
        
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://y.qq.com/'
            }
        })
        const result = await res.json()
        
        console.log('[QQMusic Refresh] Response:', JSON.stringify(result).substring(0, 500))

        if (result.req_0 && result.req_0.data && result.req_0.data.musickey) {
            const loginData = result.req_0.data
            const newCookie = `uin=${uin}; qqmusic_key=${loginData.musickey}`
            return {
                success: true,
                cookie: newCookie,
                musickey: loginData.musickey,
                expire: loginData.musickey_expiretime || null,
                refreshToken: loginData.refresh_token || null
            }
        }

        const errorMsg = result.req_0?.data?.errmsg || result.req_0?.code || JSON.stringify(result)
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

        console.log('[QQMusic Refresh] Using refresh_token')

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://y.qq.com/'
            }
        })
        const result = await res.json()

        if (result.req_0 && result.req_0.data && result.req_0.data.musickey) {
            const loginData = result.req_0.data
            const newCookie = `uin=${uin}; qqmusic_key=${loginData.musickey}`
            return {
                success: true,
                cookie: newCookie,
                musickey: loginData.musickey,
                refreshToken: loginData.refresh_token || refreshToken,
                expire: loginData.musickey_expiretime || null
            }
        }

        const errorMsg = result.req_0?.data?.errmsg || result.req_0?.code || JSON.stringify(result)
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
