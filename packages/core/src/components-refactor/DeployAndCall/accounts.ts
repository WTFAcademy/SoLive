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
    label: `(${ethers.utils.formatEther(item.balance).toString()} ETH) ${item.account}`,
    value: item.account,
  }));
}
