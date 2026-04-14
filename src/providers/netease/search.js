import { request } from "./util.js"
import { map_song_list } from "./util.js"

export const get_search_songs = async (id, cookie = '') => {

    const data = {
        s: id,
        type: 1,
        limit: 30,
        offset: 0,
        total: true,
    }

    const res = await request('POST', `https://interface.music.163.com/eapi/cloudsearch`, data, {
        crypto: 'eapi',
        cookie: cookie || {},
        url: '/api/cloudsearch/pc'
    })

    return map_song_list(res.result)

}
