
import * as WebSocket from 'ws'
import * as Event from 'events'
import { onMessage, request, notify, fetchProto, Middleware } from './common';


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

export default class Pine extends Event.EventEmitter {

    private ws: WebSocket


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
                onMessage.call(this, data)
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

    // Request 请求
    public request(route: string, data: any, ...middlewares: Middleware[]): Promise<any> {
        return request.call(this, route, data, ...middlewares)
    }

    // Notify 无回复通知
    public notify(route: string, data: any) {
        notify.call(this, route, data)
    }

    // 获取proto
    public fetchProto(serverKind: string, forceUpdate: boolean = false) {
        return fetchProto.call(this, serverKind, forceUpdate)
    }
}

