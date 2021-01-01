
import * as protobuf from 'protobufjs';
import { message } from './pine_msg/compiled'
import { TextDecoder, TextEncoder } from './en_decoder';
import Pine from 'pine-client/src/node';

const ProtoMap: ProtoMap = {}

const PineMsg = message.PineMsg
const Root = protobuf.Root;

(protobuf as any).loadFromString = (name, protoStr) => {
    const fetchFunc = Root.prototype.fetch;
    Root.prototype.fetch = (_, cb) => cb(null, protoStr);
    const root = new Root().load(name);
    Root.prototype.fetch = fetchFunc;
    return root;
};

const requestMap = {}
const MaxRequestID = 50000;
let RequestID = 1

const ServerDist: {
    kindToCode: { [serverKind: string]: number },
    codeToKind: { [serverCode: number]: string }
} = {
    kindToCode: {},
    codeToKind: {}
}

export interface HandlerMap {
    handlerToCode: { [handler: string]: number },
    codeToHandler: { [code: number]: string },
}

export interface EventMap {
    eventToCode: { [event: string]: number },
    codeToEvent: { [code: number]: string },
}

export interface ProtoMap {
    [serverKind: string]: {
        protobufRoot: protobuf.Root,
        handlers: HandlerMap
        events: EventMap
    }
}

export function initSysEvent(pine: Pine) {
    pine.on('connector.__serverdict__', (data) => {
        Object.assign(ServerDist, data)
    })
}
// Request 请求
export function request(route: string, data: any, cb: (data: any) => any) {

    const [serverKind, handler] = route.split('.')

    const protobufRoot = ProtoMap[serverKind] ? ProtoMap[serverKind].protobufRoot : undefined
    let RequestType
    try {
        RequestType = protobufRoot.lookupType(route)
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

    try {
        const serverKindCode = ServerDist.kindToCode[serverKind]
        const handlerCode = ProtoMap[serverKind].handlers.handlerToCode[handler]
        if (serverKindCode && handlerCode) {
            route = new TextDecoder().decode(new Uint8Array([serverKindCode, handlerCode]))
        }
    } catch (e) {
        //
    }

    const msesage = PineMsg.create({
        Route: route,
        RequestID,
        Data: encodedData
    });

    const buffer = PineMsg.encode(msesage).finish();

    this.ws.send(buffer, { binary: true })

    requestMap[RequestID] = cb
    RequestID++
    if (RequestID >= MaxRequestID) {
        RequestID = 1
    }
}

// Notify 无回复通知
export function notify(route: string, data: any) {

    const serverKind = route.split('.')[0]

    const protobufRoot = ProtoMap[serverKind] ? ProtoMap[serverKind].protobufRoot : undefined
    let RequestType
    try {
        RequestType = protobufRoot.lookupType(route)
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

    const msesage = PineMsg.create({
        Route: route,
        RequestID: 0,
        Data: encodedData
    });

    const buffer = PineMsg.encode(msesage).finish();

    this.ws.send(buffer, { binary: true })
}

// 获取proto文件
export function fetchProto(serverKind: string) {
    return new Promise(resolve => {
        this.request(`${serverKind}.__FetchProto__`, '', async (data) => {
            await parseCompressInfo(data)
            resolve(data)
        })
    })

}

// 解析编码压缩元信息
async function parseCompressInfo(data) {

    const serverKind = data.serverKind

    let protobufRoot
    if (data.protobuf) {
        protobufRoot = await (protobuf as any).loadFromString(serverKind, data.protobuf)
    }


    const handlers: HandlerMap = { handlerToCode: {}, codeToHandler: {} }
    if (data.handlers && data.handlers instanceof Array) {
        data.handlers.forEach((handler, index) => {
            const code = index + 1
            handlers.handlerToCode[handler] = code
            handlers.codeToHandler[code] = handler
        })
    }


    const events: EventMap = { eventToCode: {}, codeToEvent: {} }
    if (data.events && data.events instanceof Array) {
        data.events.forEach((event, index) => {
            const code = index + 1
            events.eventToCode[event] = code
            events.codeToEvent[code] = event
        })
    }

    ProtoMap[serverKind] = {
        protobufRoot,
        handlers,
        events
    }
}


export function onMessage(data) {
    const message = PineMsg.decode(data as Buffer)
    const result = message.toJSON()
    try {
        const routeBytes = new TextEncoder().encode(result.Route)
        if (routeBytes.length === 2) {
            const serverKind = ServerDist.codeToKind[routeBytes[0]]
            if (result.RequestID) {
                const handler = ProtoMap[serverKind].handlers.codeToHandler[routeBytes[1]]
                result.Route = `${serverKind}.${handler}`
            } else {
                const event = ProtoMap[serverKind].events.codeToEvent[routeBytes[1]]
                result.Route = `${serverKind}.${event}`
            }

        }

        const serverKind = result.Route.split('.')[0]
        const protobufRoot = ProtoMap[serverKind] ? ProtoMap[serverKind].protobufRoot : undefined

        if (result.RequestID) {
            const cb = requestMap[result.RequestID]

            if (cb) {
                delete requestMap[result.RequestID]

                let RequestType
                try {
                    RequestType = protobufRoot.lookupType(result.Route + 'Resp')
                } catch (e) {
                    // console.log(`${result.Route}'s proto message is not found.`, e)
                }

                if (RequestType) {
                    const data = RequestType.decode(message.Data)
                    cb(data)
                } else {
                    const data = new TextDecoder().decode((message.Data))
                    cb(JSON.parse(data))
                }

            } else {
                console.error('No callback response;', result)
            }
        } else {

            let RequestType
            try {
                RequestType = protobufRoot.lookupType(result.Route)
            } catch (e) {
                // console.log(`${result.Route}'s proto message is not found.`)
            }

            let data
            if (RequestType) {
                data = RequestType.decode(message.Data)
            } else {
                data = new TextDecoder().decode((message.Data))
                data = JSON.parse(data)
            }
            this.emit(result.Route, data)
        }
    } catch (e) {
        console.error(e, '\nData:', JSON.stringify(result))
    }

}