
import * as WebSocket from 'ws'
import * as Event from 'events'
import * as protobuf from 'protobufjs';

const Type = protobuf.Type;
const Root = protobuf.Root;

(protobuf as any).loadFromString = (name, protoStr) => {
    const fetchFunc = Root.prototype.fetch;
    Root.prototype.fetch = (_, cb) => cb(null, protoStr);
    const root = new Root().load(name);
    Root.prototype.fetch = fetchFunc;
    return root;
};

const PineMessage = Type.fromJSON('PineMessage', {
    fields: {
        'Route': {
            rule: 'required',
            type: 'string',
            id: 1
        },
        'RequestID': {
            rule: 'optional',
            type: 'int32',
            id: 2
        },
        'Data': {
            rule: 'required',
            type: 'bytes',
            id: 3
        }
    }
});


const requestMap = {}
const MaxRequestID = 50000;
export interface ProtoMap {
    [serverKind: string]: {
        client: protobuf.Root,
        server: protobuf.Root
    }
}

export default class Pine extends Event.EventEmitter {

    private ws: WebSocket
    private RequestID = 1

    public static ProtoMap: ProtoMap = {}

    public static init() {
        const pine = new Pine()

        pine.on('connector.__send_err__', (data) => {
            console.error('消息发送失败:' + JSON.stringify(data))
        })

        pine.on('connector.__protojson__', (data) => {
            Pine.ProtoMap = data
        })

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

            // this.ws.onmessage = (event: WebSocket.MessageEvent) => {
            //    console.info('event.data:', new Uint8Array(event.data as any))
            // }
            this.ws.addListener('message', (data: WebSocket.Data) => {
                const message = PineMessage.decode(data as Buffer)
                const result = message.toJSON()


                const serverKind = result.Route.split('.')[0]
                const clientProtoRoot = Pine.ProtoMap[serverKind] ? Pine.ProtoMap[serverKind].client : undefined

                if (result.RequestID) {
                    const cb = requestMap[result.RequestID]

                    if (cb) {
                        delete requestMap[result.RequestID]

                        let RequestType
                        try {
                            RequestType = clientProtoRoot.lookupType(result.Route + 'Resp')
                        } catch (e) {
                            // console.log(`${result.Route}'s proto message is not found.`, e)
                        }

                        if (RequestType) {
                            const data = RequestType.decode((message as any).Data)
                            cb(data)
                        } else {
                            const data = new TextDecoder('utf-8').decode(((message as any).Data))
                            cb(JSON.parse(data))
                        }

                    } else {
                        console.error('No callback response;', result)
                    }
                } else {

                    let RequestType
                    try {
                        RequestType = clientProtoRoot.lookupType(result.Route)
                    } catch (e) {
                        // console.log(`${result.Route}'s proto message is not found.`)
                    }

                    let data
                    if (RequestType) {
                        data = RequestType.decode((message as any).Data)
                    } else {
                        data = new TextDecoder('utf-8').decode(((message as any).Data))
                    }

                    this.emit(result.Route, data)
                }
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

        const serverKind = route.split('.')[0]

        const serverProtoRoot = Pine.ProtoMap[serverKind] ? Pine.ProtoMap[serverKind].server : undefined
        let RequestType
        try {
            RequestType = serverProtoRoot.lookupType(route)
        } catch (e) {
            // console.log(`${route}'s proto message is not found.`)
        }
        // RequestType=null
        let encodedData: Uint8Array;
        if (RequestType) {
            encodedData = RequestType.encode(data).finish()
        } else {
            encodedData = new TextEncoder().encode(JSON.stringify(data))
        }

        const msesage = PineMessage.create({
            Route: route,
            RequestID: this.RequestID,
            Data: encodedData
        });

        const buffer = PineMessage.encode(msesage).finish();

        this.ws.send(buffer, { binary: true })

        requestMap[this.RequestID] = cb
        this.RequestID++
        if (this.RequestID >= MaxRequestID) {
            this.RequestID = 1
        }
    }

    // Notify 无回复通知
    public notify(route: string, data: any) {

        const serverKind = route.split('.')[0]

        const serverProtoRoot = Pine.ProtoMap[serverKind] ? Pine.ProtoMap[serverKind].server : undefined
        let RequestType
        try {
            RequestType = serverProtoRoot.lookupType(route)
        } catch (e) {
            // console.log(`${route}'s proto message is not found.`)
        }
        // RequestType=null
        let encodedData: Uint8Array;
        if (RequestType) {
            encodedData = RequestType.encode(data).finish()
        } else {
            encodedData = new TextEncoder().encode(JSON.stringify(data))
        }

        const msesage = PineMessage.create({
            Route: route,
            RequestID: 0,
            Data: encodedData
        });

        const buffer = PineMessage.encode(msesage).finish();

        this.ws.send(buffer, { binary: true })
    }

    public fetchProto(serverKind: string) {
        return new Promise(resolve => {
            this.request(`${serverKind}.FetchProto__`, '', async (data) => {

                let clientProtoRoot
                if (data.client) {
                    clientProtoRoot = await (protobuf as any).loadFromString(serverKind, data.client)
                }
                let serverProtoRoot
                if (data.server) {
                    serverProtoRoot = await (protobuf as any).loadFromString(serverKind, data.server)
                }

                Pine.ProtoMap[serverKind] = {
                    client: clientProtoRoot,
                    server: serverProtoRoot
                }

                resolve(data)
            })
        })

    }

}

