
import { Provider } from '@remix-project/remix-simulator';

let provider: any = null

export function init(data: any) {
  return new Promise((resolve: any) => {
    provider = new Provider({ fork: data.fork })
    if (provider) provider.init().then(() => {
      resolve();
    });
  })
}

export function sendAsync(data: any) {
  return new Promise((resolve) => {
    if (provider) {
      if (data.query.method === 'eth_chainId') {

      }

      provider.sendAsync(data.query, (error: any, result: any) => {
        resolve({
          cmd: 'sendAsyncResult',
          error,
          result,
          stamp: data.stamp
        })
      })
    } else {
      resolve({
        cmd: 'sendAsyncResult',
        error: 'Provider not instantiated',
        result: null,
        stamp: data.stamp
      })
    }
  })
}


