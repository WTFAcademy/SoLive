import {Hardfork} from "@ethereumjs/common";
import {providers} from "ethers";

class VmProvider {
  worker: Worker;
  provider: providers.JsonRpcProvider;

  constructor() {
    // @ts-ignore
    this.worker = new Worker(new URL('./worker.js', import.meta.url), {type: "module"})
    this.worker.postMessage({ cmd: 'init', fork: Hardfork.London });

    let incr = 0
    const stamps: any = {}
    this.worker.addEventListener('message', (msg) => {
      if (stamps[msg.data.stamp]) {
        stamps[msg.data.stamp](msg.data.error, msg.data.result)
      }
    })
    const provider = {
      sendAsync: (query: any, callback: any) => {
        const stamp = Date.now() + incr
        incr++
        stamps[stamp] = callback
        this.worker.postMessage({ cmd: 'sendAsync', query, stamp })
      }
    }

    this.provider = new providers.Web3Provider(provider);
  }

  async getAccounts() {
    return await this.provider.listAccounts()
  }

  async getSigner(address: string) {
    return this.provider.getSigner(address)
  }
}

export default VmProvider;
