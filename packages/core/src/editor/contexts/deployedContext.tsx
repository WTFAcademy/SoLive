import React, {useState} from "react";

import {TCompiledContract} from "../../types/contract";


type TContext = {
  compiledContract: TCompiledContract;
  setCompiledContract: (compiledContract: TCompiledContract) => void;
}

const DeployedContext = React.createContext<TContext | undefined>(undefined);

// Editor Provider
export function DeployedProvider({children}: { children: React.ReactNode }) {
  const [compiledContract, setCompiledContract] = useState<TCompiledContract>({} as TCompiledContract);

  return (
    <DeployedContext.Provider
      value={{
        compiledContract,
        setCompiledContract
      }}
    >
      {children}
    </DeployedContext.Provider>
  );
}

export function useDeployed() {
  const context = React.useContext(DeployedContext);

  if (context === undefined) {
    throw new Error("useDeploy must be used withing a provider");
  }

  return context;
}
