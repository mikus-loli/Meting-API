import { request } from "./util.js"
import { map_song_list } from "./util.js"

export const get_song_url = async (id, cookie = '') => {

    const data = {
        ids: '[' + id + ']',
        level: 'standard',
        encodeType: 'flac',
    }

    let res = {}

    try {
        res = await request(
            'POST',
            `https://interface.music.163.com/eapi/song/enhance/player/url/v1`,
            data,
            {
                crypto: 'eapi',
                url: '/api/song/enhance/player/url/v1',
                cookie: cookie || {}
            },
        )
    } catch (e) {
        console.error(e)
    }

    const url = res.data && res.data[0]?.url?.replace('http://', 'https://')
    return url || `https://music.163.com/song/media/outer/url?id=${id}.mp3`

}

export const get_song_info = async (id, cookie = '') => {
    const ids = [id]
    const data = {
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
    }
    let res = await request('POST', `https://music.163.com/api/v3/song/detail`, data, {
        crypto: 'weapi',
        cookie: cookie || {}
    })

    if (!res.songs) {
        throw res
    }

    res = map_song_list(res)
    return res
}
