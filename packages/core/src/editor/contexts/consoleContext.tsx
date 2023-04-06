import React, {useState} from "react";

import {createConsoleMessage, TConsoleMessage, TInputConsoleMessage} from "../../types/console";

type TContext = {
  consoles: TConsoleMessage[];
  addConsole: (consoleMessages: TInputConsoleMessage[]) => void;
}

const ConsoleContext = React.createContext<TContext | undefined>(undefined);

// Editor Provider
export function ConsoleProvider({children}: { children: React.ReactNode }) {
  const [consoles, setConsoles] = useState<TConsoleMessage[]>([]);

  const addConsole = (consoleMessages: TInputConsoleMessage[]) => {
    const inputConsoleMessages = consoleMessages.map(msg => createConsoleMessage(msg))
    setConsoles(old => [...old, ...inputConsoleMessages]);
  }

  return (
    <ConsoleContext.Provider
      value={{
        consoles,
        addConsole
      }}
    >
      {children}
    </ConsoleContext.Provider>
  );
}

export function useConsole() {
  const context = React.useContext(ConsoleContext);

  if (context === undefined) {
    throw new Error("useConsole must be used withing a provider");
  }

  return context;
}
