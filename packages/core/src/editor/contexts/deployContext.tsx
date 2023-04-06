import React, {useState} from "react";
import {TCompiledContract} from "../../types/contract";


type TContext = {
  compiledContract: TCompiledContract;
  setCompiledContract: (compiledContract: TCompiledContract) => void;
}

const DeployContext = React.createContext<TContext | undefined>(undefined);

// Editor Provider
export function DeployProvider({children}: { children: React.ReactNode }) {
  const [compiledContract, setCompiledContract] = useState<TCompiledContract>({} as TCompiledContract);

  return (
    <DeployContext.Provider
      value={{
        compiledContract,
        setCompiledContract
      }}
    >
      {children}
    </DeployContext.Provider>
  );
}

export function useDeploy() {
  const context = React.useContext(DeployContext);

  if (context === undefined) {
    throw new Error("useDeploy must be used withing a provider");
  }

  return context;
}
