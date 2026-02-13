"use client";

import { createContext, useContext, useState, FC, ReactNode } from "react";

import { SeverityType } from "@/types/Alert";

import AlertSnackbar from "@/components/common/AlertSnackbar";

type AlertContextValue = {
  showAlert: (msg: string, severity?: SeverityType) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export const useAlertContext = () => {
  const ctx = useContext(AlertContext);

  if (!ctx) {
    throw new Error("useAlertContext must be used within AlertProvider");
  }

  return ctx;
};

type Props = { children: ReactNode };

export const AlertProvider: FC<Props> = (props) => {
  const { children } = props;

  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<SeverityType>("success");

  const showAlert = (msg: string, sev: SeverityType = "success") => {
    setMessage(msg);
    setSeverity(sev);
  };

  const closeAlert = () => setMessage(null);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <AlertSnackbar
        message={message}
        severity={severity}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
};

