import { Provider } from '@remix-project/remix-simulator';

let provider: Provider | null = null;
globalThis.onmessage = (e: MessageEvent) => {
  const { data } = e;
  // eslint-disable-next-line default-case
  switch (data.cmd) {
    case 'init':
    {
      provider = new Provider({ fork: data.fork });
      if (provider) provider.init().then();
      break;
    }
    case 'sendAsync':
    {
      if (provider) {
        provider.sendAsync(data.query, (error: any, result: any) => {
          globalThis.postMessage({
            cmd: 'sendAsyncResult',
            error: JSON.stringify(error),
            result,
            stamp: data.stamp,
          });
        });
      } else {
        globalThis.postMessage({
          cmd: 'sendAsyncResult',
          error: 'Provider not instantiated',
          result: null,
          stamp: data.stamp,
        });
      }

      break;
    }
  }
};
