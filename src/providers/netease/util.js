import encrypt from './crypto.js'
import { net_ease_anonymous_token } from './config.js'
import { customAlphabet } from 'nanoid/non-secure'

const nanoid = customAlphabet('1234567890abcdef', 32)

const chooseUserAgent = (ua = false) => {
    const userAgentList = {
        mobile: [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML like Gecko) Mobile/14A456 QQ/6.5.7.408 V1_IPH_SQ_6.5.7_1_APP_A Pixel/750 Core/UIWebView NetType/4G Mem/103',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f27) NetType/WIFI Language/zh',
            'Mozilla/5.0 (Linux; Android 9; PCT-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.64 HuaweiBrowser/10.0.3.311 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; U; Android 9; zh-cn; Redmi Note 8 Build/PKQ1.190616.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/12.5.22',
            'Mozilla/5.0 (Linux; Android 10; YAL-AL00 Build/HUAWEIYAL-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2581 MMWEBSDK/200801 Mobile Safari/537.36 MMWEBID/3027 MicroMessenger/7.0.18.1740(0x27001235) Process/toolsmp WeChat/arm64 NetType/WIFI Language/zh_CN ABI/arm64',
            'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BKK-AL10 Build/HONORBKK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/10.6 Mobile Safari/537.36',
        ],
        pc: [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
        ],
    }
    let realUserAgentList =
        userAgentList[ua] || userAgentList.mobile.concat(userAgentList.pc)
    return ['mobile', 'pc', false].indexOf(ua) > -1
        ? realUserAgentList[Math.floor(Math.random() * realUserAgentList.length)]
        : ua
}

const cnip = () => {
    const ips = '58.14.0.0,58.16.0.0,58.24.0.0,58.30.0.0,58.32.0.0,58.66.0.0,58.68.128.0,58.82.0.0,58.87.64.0,58.99.128.0,58.100.0.0,58.116.0.0,58.128.0.0,58.144.0.0,58.154.0.0,58.192.0.0,58.240.0.0,59.32.0.0,59.64.0.0,59.80.0.0,59.107.0.0,59.108.0.0,59.151.0.0,59.155.0.0,59.172.0.0,59.191.0.0,59.191.240.0,59.192.0.0,60.0.0.0,60.55.0.0,60.63.0.0,60.160.0.0,60.194.0.0,60.200.0.0,60.208.0.0,60.232.0.0,60.235.0.0,60.245.128.0,60.247.0.0,60.252.0.0,60.253.128.0,60.255.0.0,61.4.80.0,61.4.176.0,61.8.160.0,61.28.0.0,61.29.128.0,61.45.128.0,61.47.128.0,61.48.0.0,61.87.192.0,61.128.0.0,61.232.0.0,61.236.0.0,61.240.0.0,114.28.0.0,114.54.0.0,114.60.0.0,114.64.0.0,114.68.0.0,114.80.0.0,116.1.0.0,116.2.0.0,116.4.0.0,116.8.0.0,116.13.0.0,116.16.0.0,116.52.0.0,116.56.0.0,116.58.128.0,116.58.208.0,116.60.0.0,116.66.0.0,116.69.0.0,116.70.0.0,116.76.0.0,116.89.144.0,116.90.184.0,116.95.0.0,116.112.0.0,116.116.0.0,116.128.0.0,116.192.0.0,116.193.16.0,116.193.32.0,116.194.0.0,116.196.0.0,116.198.0.0,116.199.0.0,116.199.128.0,116.204.0.0,116.207.0.0,116.208.0.0,116.212.160.0,116.213.64.0,116.213.128.0,116.214.32.0,116.214.64.0,116.214.128.0,116.215.0.0,116.216.0.0,116.224.0.0,116.242.0.0,116.244.0.0,116.248.0.0,116.252.0.0,116.254.128.0,116.255.128.0,117.8.0.0,117.21.0.0,117.22.0.0,117.24.0.0,117.32.0.0,117.40.0.0,117.44.0.0,117.48.0.0,117.53.48.0,117.53.176.0,117.57.0.0,117.58.0.0,117.59.0.0,117.60.0.0,117.64.0.0,117.72.0.0,117.74.64.0,117.74.128.0,117.75.0.0,117.76.0.0,117.80.0.0,117.100.0.0,117.103.16.0,117.103.128.0,117.106.0.0,117.112.0.0,117.120.64.0,117.120.128.0,117.121.0.0,117.121.128.0,117.121.192.0,117.122.128.0,117.124.0.0,117.128.0.0,118.24.0.0,118.64.0.0,118.66.0.0,118.67.112.0,118.72.0.0,118.80.0.0,118.84.0.0,118.88.32.0,118.88.64.0,118.88.128.0,118.89.0.0,118.91.240.0,118.102.16.0,118.112.0.0,118.120.0.0,118.124.0.0,118.126.0.0,118.132.0.0,118.144.0.0,118.178.0.0,118.180.0.0,118.184.0.0,118.192.0.0,118.212.0.0,118.224.0.0,118.228.0.0,118.230.0.0,118.239.0.0,118.242.0.0'
    const arr = ips.split(',');
    const rnd = parseInt(Math.random() * ((arr.length - 1) - 0 + 1) + 0, 10)
    const ip = arr[rnd];
    return ip;
}

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

export const request = async (method, url, data = {}, options) => {

    let headers = { 'User-Agent': chooseUserAgent(options.ua) }
    if (method.toUpperCase() === 'POST')
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (url.includes('music.163.com'))
        headers['Referer'] = 'https://music.163.com'

    let ip = cnip() || ''
    if (ip) {
        headers['X-Real-IP'] = ip
        headers['X-Forwarded-For'] = ip
    }
    
    if (typeof options.cookie === "undefined")
        options.cookie = {}

    if (typeof options.cookie === 'string') {
        options.cookie = parseCookieString(options.cookie)
    }

    if (typeof options.cookie === 'object') {
        options.cookie = {
            ...options.cookie,
            __remember_me: true,
            _ntes_nuid: nanoid(),
        }
        if (!options.cookie.MUSIC_U) {
            if (!options.cookie.MUSIC_A) {
                options.cookie.MUSIC_A = net_ease_anonymous_token
            }
        }
        headers['Cookie'] = Object.keys(options.cookie)
            .map(
                (key) =>
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(options.cookie[key]),
            )
            .join('; ')
    } else if (options.cookie) {
        headers['Cookie'] = options.cookie
    } else {
        headers['Cookie'] = '__remember_me=true; NMTID=xxx'
    }

    if (options.crypto === 'weapi') {
        let csrfToken = (headers['Cookie'] || '').match(/_csrf=([^(;|$)]+)/)
        data.csrf_token = csrfToken ? csrfToken[1] : ''
        data = encrypt.weapi(data)
        url = url.replace(/\w*api/, 'weapi')
    } else if (options.crypto === 'linuxapi') {
        data = encrypt.linuxapi({
            method: method,
            url: url.replace(/\w*api/, 'api'),
            params: data,
        })
        headers['User-Agent'] =
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
        url = 'https://music.163.com/api/linux/forward'
    } else if (options.crypto === 'eapi') {
        const cookie = options.cookie || {}
        const csrfToken = cookie['__csrf'] || ''
        const header = {
            osver: cookie.osver,
            deviceId: cookie.deviceId,
            appver: cookie.appver || '8.7.01',
            versioncode: cookie.versioncode || '140',
            mobilename: cookie.mobilename,
            buildver: cookie.buildver || Date.now().toString().substr(0, 10),
            resolution: cookie.resolution || '1920x1080',
            __csrf: csrfToken,
            os: cookie.os || 'android',
            channel: cookie.channel,
            requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
                .toString()
                .padStart(4, '0')
                } `,
        }
        if (cookie.MUSIC_U) header['MUSIC_U'] = cookie.MUSIC_U
        if (cookie.MUSIC_A) header['MUSIC_A'] = cookie.MUSIC_A
        headers['Cookie'] = Object.keys(header)
            .map(
                (key) =>
                    encodeURIComponent(key) + '=' + encodeURIComponent(header[key]),
            )
            .join('; ')
        data.header = header
        data = encrypt.eapi(options.url, data)
        url = url.replace(/\w*api/, 'eapi')
    }

    let settings = {
        method,
        headers,
        body: new URLSearchParams(data).toString()
    }


    if (options.crypto === 'eapi') {
        settings = {
            ...settings,
            responseType: 'arraybuffer',
        }
    }


    let res, count = 0
    do {
        res = await fetch(url, settings)
        if (options.crypto === 'eapi') {
            const _ = await res.arrayBuffer('utf-8')
            const enc = new TextDecoder()
            res = JSON.parse(enc.decode(_))
        } else {
            res = await res.json()
        }
        count++
        if (count > 1) {
            console.log(`Request ${count} times.`)
        }
        if (count > 5) {
            console.error(`Max retries exceeded.`)
            break
        }
        await new Promise(resolve => setTimeout(resolve, 100))
    } while (res.code == -460)

    return res;

}

export const map_song_list = (song_list) => {
    return song_list.songs.map(song => {
        const artists = song.ar || song.artists
        return {
            title: song.name,
            author: artists.reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
            pic: song?.al?.picUrl || song.id,
            url: song.id,
            lrc: song.id
        }
    })
}
