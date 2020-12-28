
import * as WebSocket from 'ws'
import * as Event from 'events'
import { initSysEvent, onMessage, request, notify, fetchProto } from './common';


process.on('uncaughtException', (error) => {
    console.error(error)
})

process.on('unhandledRejection', (error) => {
    console.error(error)
})


export default class Pine extends Event.EventEmitter {

    private ws: WebSocket


    public static init() {
        const pine = new Pine()

        initSysEvent.call(this, pine)

        return pine
    }

    // 建立连接
    public connect(wsUrl: string) {

        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(wsUrl)
            this.ws.onopen = async (_: WebSocket.OpenEvent) => {
                await fetchProto.call(this, 'connector')
                resolve(this.ws)
            }

            // this.ws.onmessage = (event: WebSocket.MessageEvent) => {
            //    console.info('event.data:', new Uint8Array(event.data as any))
            // }
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
    public request(route: string, data: any, cb: (data: any) => any) {
        request.call(this, route, data, cb)
    }

    // Notify 无回复通知
    public notify(route: string, data: any) {
        notify.call(this, route, data)
    }
}

