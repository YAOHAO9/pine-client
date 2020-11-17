
import * as WebSocket from 'ws'
import * as Event from 'events'

const requestMap = {}
const MaxRequestID = 50000;

export default class Pine extends Event.EventEmitter {

    private ws: WebSocket
    private requestID = 1

    public static init() {
        const pine = new Pine()
        return pine
    }

    public connect(wsUrl: string) {

        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(wsUrl)
            this.ws.onopen = async (_: WebSocket.OpenEvent) => {
                resolve(this.ws)
                reject = null
            }

            this.ws.onmessage = (event: WebSocket.MessageEvent) => {
                const result = JSON.parse(event.data.toString())
                if (result.RequestID) {
                    const cb = requestMap[result.RequestID]
                    delete requestMap[result.RequestID]
                    cb(result.Data)
                } else {
                    this.emit(result.Route, result.Data)
                }
            }

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

    public request(route: string, data: any, cb: (data: any) => any) {

        this.ws.send(JSON.stringify({
            Route: route,
            RequestID: this.requestID,
            Data: data
        }))

        requestMap[this.requestID] = cb
        this.requestID++
        if (this.requestID >= MaxRequestID) {
            this.requestID = 1
        }
    }
}

