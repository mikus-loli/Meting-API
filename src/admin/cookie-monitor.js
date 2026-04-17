import store from './store.js'
import { validateCookie } from './cookie-validator.js'

class CookieMonitor {
    constructor() {
        this.timer = null
        this.isRunning = false
        this.lastCheckTime = null
        this.checkCount = 0
        this.errorCount = 0
    }

    start() {
        if (this.isRunning) {
            console.log('[CookieMonitor] 监测服务已在运行中')
            return
        }

        const config = store.getMonitorConfig()
        if (!config.enabled) {
            console.log('[CookieMonitor] 监测服务未启用')
            return
        }

        this.isRunning = true
        this.scheduleNextCheck()
        console.log(`[CookieMonitor] 监测服务已启动，间隔: ${config.interval}分钟`)
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        this.isRunning = false
        console.log('[CookieMonitor] 监测服务已停止')
    }

    restart() {
        this.stop()
        this.start()
    }

    scheduleNextCheck() {
        if (!this.isRunning) return

        const config = store.getMonitorConfig()
        const intervalMs = config.interval * 60 * 1000

        this.timer = setTimeout(async () => {
            await this.performCheck()
            this.scheduleNextCheck()
        }, intervalMs)
    }

    async performCheck() {
        if (!this.isRunning) return

        this.lastCheckTime = Date.now()
        this.checkCount++

        console.log(`[CookieMonitor] 开始第 ${this.checkCount} 次检查...`)

        try {
            const cookies = store.getCookies()
            const activeCookies = cookies.filter(c => c.isActive)

            for (const cookie of activeCookies) {
                await this.checkCookie(cookie)
            }

            await store.addMonitorLog({
                type: 'check_complete',
                totalChecked: activeCookies.length,
                checkCount: this.checkCount
            })

            console.log(`[CookieMonitor] 检查完成，共检查 ${activeCookies.length} 个Cookie`)
        } catch (error) {
            this.errorCount++
            console.error('[CookieMonitor] 检查出错:', error.message)
            
            await store.addMonitorLog({
                type: 'check_error',
                error: error.message,
                checkCount: this.checkCount
            })
        }
    }

    async checkCookie(cookie) {
        try {
            const result = await validateCookie(cookie.platform, cookie.cookie)
            
            const wasValid = cookie.isValid
            const nowValid = result.valid
            const wasCanPlayVip = cookie.userInfo?.canPlayVip
            const nowCanPlayVip = result.userInfo?.canPlayVip

            if (wasValid === true && nowValid === false) {
                await this.handleCookieInvalid(cookie, result.error)
            }

            if (nowValid && wasCanPlayVip === true && nowCanPlayVip === false) {
                await this.handleVipLost(cookie)
            }

            await store.updateCookie(cookie.id, {
                isValid: nowValid,
                validatedAt: Date.now(),
                userInfo: result.userInfo,
                validationError: result.error
            }, 'monitor', true)

            return { valid: nowValid, changed: wasValid !== nowValid }
        } catch (error) {
            console.error(`[CookieMonitor] 检查Cookie ${cookie.id} 出错:`, error.message)
            return { valid: false, error: error.message }
        }
    }

    async handleCookieInvalid(cookie, reason) {
        const platformName = cookie.platform === 'netease' ? '网易云音乐' : 'QQ音乐'
        
        console.log(`[CookieMonitor] Cookie失效: ${platformName} - ${cookie.note || cookie.id}`)

        await store.addMonitorLog({
            type: 'cookie_invalid',
            cookieId: cookie.id,
            platform: cookie.platform,
            platformName: platformName,
            note: cookie.note,
            reason: reason || '未知原因'
        })

        await this.sendWebhookNotification({
            event: 'cookie_invalid',
            title: `Cookie失效通知 - ${platformName}`,
            message: `平台: ${platformName}\n备注: ${cookie.note || '无'}\n失效时间: ${new Date().toLocaleString('zh-CN')}\n原因: ${reason || 'Cookie已失效'}\n\n请及时更新Cookie以确保服务正常`,
            priority: 5
        })
    }

    async handleVipLost(cookie) {
        const platformName = cookie.platform === 'netease' ? '网易云音乐' : 'QQ音乐'
        
        console.log(`[CookieMonitor] VIP播放能力丢失: ${platformName} - ${cookie.note || cookie.id}`)

        await store.addMonitorLog({
            type: 'vip_lost',
            cookieId: cookie.id,
            platform: cookie.platform,
            platformName: platformName,
            note: cookie.note,
            reason: 'VIP播放能力已丢失，仅能播放试听版本'
        })

        await this.sendWebhookNotification({
            event: 'vip_lost',
            title: `VIP播放能力丢失 - ${platformName}`,
            message: `平台: ${platformName}\n备注: ${cookie.note || '无'}\n发现时间: ${new Date().toLocaleString('zh-CN')}\n状态: Cookie有效但无法播放VIP音乐\n\n请检查VIP会员状态或更新Cookie`,
            priority: 4
        })
    }

    async sendWebhookNotification(data) {
        const webhookConfig = store.getWebhookConfig()
        
        if (!webhookConfig.enabled || !webhookConfig.url) {
            console.log('[CookieMonitor] Webhook未配置或未启用，跳过通知')
            return { sent: false, reason: 'webhook_not_configured' }
        }

        const message = {
            message: data.message || '',
            title: data.title || 'Cookie监测通知',
            priority: data.priority || 5
        }

        const headers = {
            'Content-Type': 'application/json',
            ...webhookConfig.headers
        }

        try {
            const response = await fetch(webhookConfig.url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(message)
            })

            const success = response.ok

            await store.addMonitorLog({
                type: 'webhook_sent',
                success: success,
                url: webhookConfig.url,
                statusCode: response.status,
                eventData: message
            })

            if (success) {
                console.log('[CookieMonitor] Webhook通知发送成功')
            } else {
                console.error(`[CookieMonitor] Webhook通知发送失败: ${response.status}`)
            }

            return { sent: success, statusCode: response.status }
        } catch (error) {
            console.error('[CookieMonitor] Webhook发送错误:', error.message)
            
            await store.addMonitorLog({
                type: 'webhook_error',
                error: error.message,
                url: webhookConfig.url
            })

            return { sent: false, error: error.message }
        }
    }

    async testWebhook() {
        const webhookConfig = store.getWebhookConfig()
        
        if (!webhookConfig.url) {
            return { success: false, error: 'Webhook URL未配置' }
        }

        const testData = {
            title: 'Webhook测试通知',
            message: `这是一条测试消息\n发送时间: ${new Date().toLocaleString('zh-CN')}\n\n如果您收到此消息，说明Webhook配置正确`,
            priority: 5
        }

        return await this.sendWebhookNotification(testData)
    }

    getStatus() {
        const config = store.getMonitorConfig()
        const webhookConfig = store.getWebhookConfig()
        
        return {
            isRunning: this.isRunning,
            enabled: config.enabled,
            interval: config.interval,
            lastCheckTime: this.lastCheckTime,
            checkCount: this.checkCount,
            errorCount: this.errorCount,
            webhookEnabled: webhookConfig.enabled,
            webhookConfigured: !!webhookConfig.url
        }
    }

    async checkNow() {
        if (!this.isRunning) {
            const config = store.getMonitorConfig()
            if (!config.enabled) {
                return { success: false, error: '监测服务未启用' }
            }
        }

        await this.performCheck()
        return { success: true }
    }
}

const cookieMonitor = new CookieMonitor()

export default cookieMonitor
