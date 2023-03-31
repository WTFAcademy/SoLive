import uniqueId from 'lodash/uniqueId';

export type TInputConsoleMessage = {
  type: string;
  message: string
};

export type TConsoleMessage = {
  id: string;
  type: string;
  message: string;
  timestamp: number;
}

export const createConsoleMessage = ({type, message}: TInputConsoleMessage): TConsoleMessage => {
  return {
    id: uniqueId(),
    type,
    message,
    timestamp: Date.now(),
  }
}

export const generateConsoleMessageToShow = (message: TConsoleMessage) => {
  return `[${new Date(message.timestamp).toLocaleTimeString()}]: ${message.message}`
}
