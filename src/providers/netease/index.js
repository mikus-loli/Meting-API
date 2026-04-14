import { get_playlist } from "./playlist.js"
import { get_song_url, get_song_info } from "./song.js"
import { get_lyric } from "./lyric.js"
import { get_artist_songs } from "./artist_songs.js"
import { get_search_songs } from "./search.js"

const support_type = ['url', 'lrc', 'song', 'playlist', 'artist', 'search', 'pic']

const handle = async (type, id, cookie = '') => {
    let result;
    switch (type) {
        case 'lrc':
            result = await get_lyric(id, cookie)
            break
        case 'url':
            result = await get_song_url(id, cookie)
            break
        case 'pic':
            result = (await get_song_info(id, cookie))[0].pic
            break
        case 'song':
            result = await get_song_info(id, cookie)
            break
        case 'playlist':
            result = await get_playlist(id, cookie)
            break
        case 'artist':
            result = await get_artist_songs(id, cookie)
            break
        case 'search':
            result = await get_search_songs(id, cookie)
            break
        default:
            return -1;
    }
    return result
}

export default {
    register: (ctx) => {
        ctx.register('netease', { handle, support_type })
    }
}
