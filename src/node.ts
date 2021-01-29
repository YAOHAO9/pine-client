
import * as WebSocket from 'ws'
import { BasePine } from './common';

process.on('uncaughtException', (error) => {
    console.error('uncaughtException:', error)
})

process.on('unhandledRejection', (error) => {
    console.error('unhandledRejection:', error)
})

process.on('rejectionHandled', (error) => {
    console.error('rejectionHandled:', error)
})

process.on('uncaughtExceptionMonitor', (error) => {
    console.error('uncaughtExceptionMonitor:', error)
})

export default class Pine extends BasePine {

    protected ws: WebSocket

    public static init() {
        const pine = new Pine()
        return pine
    }

    // 建立连接
    public connect(wsUrl: string) {

        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(wsUrl)
            this.ws.onopen = async (_: WebSocket.OpenEvent) => {
                resolve(this.ws)
                reject = null
            }

            this.ws.addListener('message', (data: WebSocket.Data) => {
                this.onMessage(data)
            })

            this.ws.onclose = (event: WebSocket.CloseEvent) => {
                console.warn('连接被关闭', event.reason)
            }

            this.ws.onerror = (event: WebSocket.ErrorEvent) => {
                console.error(event.message)
                if (reject) {
                    reject(event)
                    resolve = null
                }
            }
        })

    }
}

