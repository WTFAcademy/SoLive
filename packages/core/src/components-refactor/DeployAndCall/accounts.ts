import VmProvider from "solive-provider";
import {ethers} from "ethers";

export const formatAccounts = async (accounts: string[], provider: VmProvider) => {
  const balances = await provider.getBalances(accounts);
  return accounts.map((account, index) => ({
    account,
    balance: balances[index],
  }));
}

export const getAccountOptions = async (accounts: string[], provider: VmProvider) => {
  const formattedAccounts = await formatAccounts(accounts, provider);
  return formattedAccounts.map((item) => ({
    label: `(${cutStringNumber(ethers.utils.formatEther(item.balance), 3)} ETH) ${item.account}`,
    value: item.account,
  }));
}


const cutStringNumber = (numStr: string, decimals: number) => {
  const index = numStr.indexOf('.'); // 找到小数点的位置
   // 截取小数点后第二位及之后的字符串
  return numStr.substring(0, index + 1 + decimals);
}
