import { request } from './util.js'
import { map_song_list } from "./util.js"

export const get_playlist = async (id, cookie = '') => {
    const data = {
        id,
        n: 100000,
        s: 8,
    }
    let limit = 200 || Infinity
    let offset = 0 || 0

    let res = await request('POST', `https://music.163.com/api/v6/playlist/detail`, data, { crypto: 'api', cookie: cookie || {} })

    let trackIds = res.playlist.trackIds

    let idsData = {
        c:
            '[' +
            trackIds
                .slice(offset, offset + limit)
                .map((item) => '{"id":' + item.id + '}')
                .join(',') +
            ']',
    }

    res = await request(
        'POST',
        `https://music.163.com/api/v3/song/detail`,
        idsData,
        { crypto: 'weapi', cookie: cookie || {} }
    )

    res = map_song_list(res)

    return res

}
