import { get_runtime } from "./util.js"

let OVERSEAS = globalThis?.Deno?.env?.get("OVERSEAS") || globalThis?.process?.env?.OVERSEAS
const runtime = get_runtime()

if (['cloudflare', 'vercel'].includes(runtime)) OVERSEAS = true

const PORT = globalThis?.Deno?.env?.get("PORT") || globalThis?.process?.env?.PORT || 3000

const ADMIN_PATH = globalThis?.Deno?.env?.get("ADMIN_PATH") || globalThis?.process?.env?.ADMIN_PATH || 'admin'

const adminPath = ADMIN_PATH.replace(/^\/+|\/+$/g, '')

OVERSEAS = Boolean(OVERSEAS)

export default {
    OVERSEAS,
    PORT,
    ADMIN_PATH: adminPath,
}
