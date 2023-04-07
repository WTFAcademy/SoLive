import {Hardfork} from "@ethereumjs/common";
import {providers} from "ethers";

type TVmProviderParams = {
  fork?: Hardfork;
}

class VmProvider {
  worker: Worker;
  provider: providers.JsonRpcProvider;

  constructor({fork = Hardfork.London}: TVmProviderParams) {
    // @ts-ignore
    this.worker = new Worker(new URL('./worker.js', import.meta.url), {type: "module"})
    this.worker.postMessage({ cmd: 'init', fork });
    console.log("init");

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

  async getBalances(addresses: string[]) {
    return await Promise.all(addresses.map(async (address) => {
      return await this.provider.getBalance(address)
    }))
  }
}

export default VmProvider;
