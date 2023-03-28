import {Hardfork} from "@ethereumjs/common";
import {providers} from "ethers";

import {init, sendAsync} from "./no-worker";
export {default as WorkerVMProvider} from "./workerVmProvider";

class NoWorkerVMProvider {
  provider: providers.JsonRpcProvider;

  constructor() {
    init({fork: Hardfork.London});


    let incr = 0
    const stamps: any = {}

    const provider: any = {
      sendAsync: (query: any, callback: any) => {
        const stamp = Date.now() + incr
        incr++
        stamps[stamp] = callback
        sendAsync({query, stamp}).then((data: any) => {
          if (stamps[data.stamp]) {
            stamps[data.stamp](data.error, data.result)
          }
        });
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

export default NoWorkerVMProvider;
