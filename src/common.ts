
import * as protobuf from 'protobufjs';
import { message } from './pine_msg/compiled'
import { TextDecoder, TextEncoder } from './en_decoder';

const CompressDataMap: ProtoMap = {}
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
const FetchProtoHandler = '__FetchProto__'

let RequestID = 1

const ServerCodeMap: {
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

interface ProtoBufData {
    serverCode: number,
    serverKind: string,
    proto: string,
    handlers: string[],
    events: string[],
}

export interface ProtoMap {
    [serverKind: string]: {
        protoRoot: protobuf.Root,
        handlers: HandlerMap
        events: EventMap
        data: ProtoBufData
    }
}

// Request 请求
export function request(route: string, data: any, cb: (data: any) => any) {

    const [serverKind, handler] = route.split('.')

    if (handler !== FetchProtoHandler && !CompressDataMap[serverKind]) {
        return console.error(`Please exec 'await pine.fetchProto("${serverKind}");' first`)
    }

    const protoRoot = CompressDataMap[serverKind] ? CompressDataMap[serverKind].protoRoot : undefined
    let RequestType
    try {
        RequestType = protoRoot.lookupType(route)
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
        const serverKindCode = ServerCodeMap.kindToCode[serverKind]
        const handlerCode = CompressDataMap[serverKind].handlers.handlerToCode[handler]
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

    const protoRoot = CompressDataMap[serverKind] ? CompressDataMap[serverKind].protoRoot : undefined
    let RequestType
    try {
        RequestType = protoRoot.lookupType(route)
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
export function fetchProto(serverKind: string, forceUpdate: boolean) {
    return new Promise<ProtoBufData>(resolve => {

        if (!forceUpdate && CompressDataMap[serverKind] && CompressDataMap[serverKind].protoRoot) {
            resolve(CompressDataMap[serverKind].data)
            return
        }

        this.request(`${serverKind}.${FetchProtoHandler}`, '', async (data: ProtoBufData) => {

            // ServerCode Map
            ServerCodeMap.codeToKind[data.serverCode] = data.serverKind
            ServerCodeMap.kindToCode[data.serverKind] = data.serverCode

            // ServerKind
            const serverKind = data.serverKind

            let protoRoot
            if (data.proto) {
                // Protobuf
                protoRoot = await (protobuf as any).loadFromString(serverKind, data.proto)
            }

            // HandlerMap
            const handlers: HandlerMap = { handlerToCode: {}, codeToHandler: {} }
            if (data.handlers && data.handlers instanceof Array) {
                data.handlers.forEach((handler, index) => {
                    const code = index + 1
                    handlers.handlerToCode[handler] = code
                    handlers.codeToHandler[code] = handler
                })
            }

            // EventMap
            const events: EventMap = { eventToCode: {}, codeToEvent: {} }
            if (data.events && data.events instanceof Array) {
                data.events.forEach((event, index) => {
                    const code = index + 1
                    events.eventToCode[event] = code
                    events.codeToEvent[code] = event
                })
            }

            CompressDataMap[serverKind] = {
                protoRoot,
                handlers,
                events,
                data,
            }

            resolve(data)
        })
    })
}


export function onMessage(data) {
    const message = PineMsg.decode(data as Buffer)
    const result = message.toJSON()
    try {
        const routeBytes = new TextEncoder().encode(result.Route)
        if (routeBytes.length === 2) {
            const serverKind = ServerCodeMap.codeToKind[routeBytes[0]]
            if (result.RequestID) {
                const handler = CompressDataMap[serverKind].handlers.codeToHandler[routeBytes[1]]
                result.Route = `${serverKind}.${handler}`
            } else {
                const event = CompressDataMap[serverKind].events.codeToEvent[routeBytes[1]]
                result.Route = `${serverKind}.${event}`
            }

        }

        const serverKind = result.Route.split('.')[0]
        const protoRoot = CompressDataMap[serverKind] ? CompressDataMap[serverKind].protoRoot : undefined

        if (result.RequestID) {
            const cb = requestMap[result.RequestID]

            if (cb) {
                delete requestMap[result.RequestID]

                let RequestType
                try {
                    RequestType = protoRoot.lookupType(result.Route + 'Resp')
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
                RequestType = protoRoot.lookupType(result.Route)
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