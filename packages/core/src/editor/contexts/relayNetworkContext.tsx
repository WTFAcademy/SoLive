import React, {useEffect, useRef, useState} from "react";
import VmProvider from "solive-provider";
import {Hardfork} from "@ethereumjs/common";


type TContext = {
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
  providerRef: React.MutableRefObject<VmProvider>;
}

const RelayNetworkContext = React.createContext<TContext | undefined>(undefined);

const DEFAULT_VM_PROVIDER = new VmProvider({fork: Hardfork.London});

// Editor Provider
export function RelayNetworkProvider({children}: { children: React.ReactNode }) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const providerRef = useRef<VmProvider>(DEFAULT_VM_PROVIDER);

  useEffect(() => {
    if (selectedNetwork) {
      providerRef.current = new VmProvider({fork: selectedNetwork as Hardfork});
    }
  }, [selectedNetwork])

  return (
    <RelayNetworkContext.Provider
      value={{
        selectedNetwork,
        setSelectedNetwork,
        providerRef
      }}
    >
      {children}
    </RelayNetworkContext.Provider>
  );
}

export function useRelayNetwork() {
  const context = React.useContext(RelayNetworkContext);

  if (context === undefined) {
    throw new Error("useRelayNetwork must be used withing a provider");
  }

  return context;
}
