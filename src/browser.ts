
import * as Event from 'events'
import { onMessage, request, notify, fetchProto, Middleware } from './common';

window.onunhandledrejection = (error) => {
    console.error(error)
}

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
            this.ws.binaryType = 'arraybuffer'

            this.ws.onopen = async (_) => {
                await fetchProto.call(this, 'connector')
                resolve(this.ws)
                reject = null
            }

            this.ws.addEventListener('message', (data) => {
                onMessage.call(this, new Uint8Array(data.data))
            })

            this.ws.onclose = (event) => {
                console.warn('连接被关闭', event.reason)
            }

            this.ws.onerror = (event) => {
                console.error(event)
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

