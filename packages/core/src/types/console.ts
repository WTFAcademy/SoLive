import uniqueId from 'lodash/uniqueId';

export type TInputConsoleMessage = {
  type: string;
  message: any;
};

export type TConsoleMessage = {
  id: string;
  type: string;
  message: string;
  timestamp: number;
}

export const createConsoleMessage = ({ type, message }: TInputConsoleMessage): TConsoleMessage => ({
  id: uniqueId(),
  type,
  message,
  timestamp: Date.now(),
});

export const generateConsoleMessageToShow = (message: TConsoleMessage): string => `[${new Date(message.timestamp).toLocaleTimeString()}]: ${message.message}`;
