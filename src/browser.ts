
import { BasePine } from './common';

(window || global).onunhandledrejection = (error) => {
  console.error(error)
}

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
      this.ws.binaryType = 'arraybuffer'

      this.ws.onopen = async (_) => {
        resolve(this.ws)
        reject = null
      }

      this.ws.addEventListener('message', (data) => {
        this.onMessage(new Uint8Array(data.data))
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
}

