import React, { useState } from 'react';

import { TCompiledContract } from '../../types/contract';

type TContext = {
  compiledContracts: TCompiledContract[];
  addCompiledContract: (compiledContract: TCompiledContract) => void;
  clearCompiledContract: () => void;
  selectedNetwork?: string;
  setSelectedNetwork: (network: string) => void;
}

const DeployedContext = React.createContext<TContext | undefined>(undefined);

// Editor Provider
export function DeployedProvider({ children }: { children: React.ReactNode }) {
  const [compiledContracts, setCompiledContracts] = useState<TCompiledContract[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>();

  const addCompiledContract = (compiledContract: TCompiledContract) => {
    setCompiledContracts((old) => [...old, compiledContract]);
  };

  const clearCompiledContract = () => {
    setCompiledContracts([]);
  };

  return (
    <DeployedContext.Provider
      value={{
        compiledContracts,
        addCompiledContract,
        clearCompiledContract,
        setSelectedNetwork,
        selectedNetwork,
      }}
    >
      {children}
    </DeployedContext.Provider>
  );
}

export function useDeployed() {
  const context = React.useContext(DeployedContext);

  if (context === undefined) {
    throw new Error('useDeploy must be used withing a provider');
  }

  return context;
}
