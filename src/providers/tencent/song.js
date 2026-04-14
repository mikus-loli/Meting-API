import { changeUrlQuery } from "./util.js"
import config from "../../config.js"

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

export const get_song_url = async (id, cookie = '') => {

    id = id.split(',')
    const cookieObj = parseCookieString(cookie)
    let uin = cookieObj.uin || ''
    let qqmusic_key = cookieObj.qqmusic_key || ''
    const typeObj = {
        s: 'M500',
        e: '.mp3',
    }

    const file = id.map(e => `${typeObj.s}${e}${e}${typeObj.e}`)
    const guid = (Math.random() * 10000000).toFixed(0);

    let purl = '';

    let data = {
        req_0: {
            module: 'vkey.GetVkeyServer',
            method: 'CgiGetVkey',
            param: {
                guid: guid,
                songmid: id,
                songtype: [0],
                uin: uin,
                loginflag: 1,
                platform: '20',
            },
        },
        comm: {
            uin: uin,
            format: 'json',
            ct: 19,
            cv: 0,
            authst: qqmusic_key,
        },
    }

    let params = {
        '-': 'getplaysongvkey',
        g_tk: 5381,
        loginUin: uin,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8¬ice=0',
        platform: 'yqq.json',
        needNewCode: 0,
        data: JSON.stringify(data),
    }


    if (config.OVERSEAS || id.length > 1) {
        params.format = 'jsonp'
        const callback_function_name = 'callback'
        const callback_name = "callback"
        const parse_function = "qq_get_url_from_json"
        const url = changeUrlQuery(params, 'https://u.y.qq.com/cgi-bin/musicu.fcg')
        return "@" + parse_function + '@' + callback_name + '@' + callback_function_name + '@' + url
    }


    const url = changeUrlQuery(params, 'https://u.y.qq.com/cgi-bin/musicu.fcg')

    let result = await fetch(url);

    result = await result.json()
    if (result.req_0 && result.req_0.data && result.req_0.data.midurlinfo) {
        purl = result.req_0.data.midurlinfo[0].purl;
    }

    const domain =
        result.req_0.data.sip.find(i => !i.startsWith('http://ws')) ||
        result.req_0.data.sip[0];

    const res = `${domain}${purl}`.replace('http://', 'https://')
    return res;

}

export const get_song_info = async (id, cookie = '') => {
    const data = {
        data: JSON.stringify({
            songinfo: {
                method: 'get_song_detail_yqq',
                module: 'music.pf_song_detail_svr',
                param: {
                    song_mid: id,
                },
            },
        }),
    };

    const url = changeUrlQuery(data, 'http://u.y.qq.com/cgi-bin/musicu.fcg');

    let result = await fetch(url);

    result = await result.json()

    result = result.songinfo.data

    let song_info = {
        author: result.track_info.singer.reduce((i, v) => ((i ? i + " / " : i) + v.name), ''),
        title: result.track_info.name,
        pic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${result.track_info.album.mid}.jpg`,
        url: config.OVERSEAS ? await get_song_url(id) : id,
        lrc: id,
        songmid: id,
    }
    return [song_info]
}

export const get_pic = async (id, cookie = '') => {
    const info = await get_song_info(id, cookie)
    return info[0].pic
}
