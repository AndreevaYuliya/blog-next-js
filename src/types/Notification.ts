import { ReactNode } from "react";

export type NotificationT = {
  message: string;
  user: string;
};

export type NotificationProviderProps = {
  children: ReactNode;
};

