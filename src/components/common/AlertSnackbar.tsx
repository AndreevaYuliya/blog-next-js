"use client";

import { FC } from "react";

import { Snackbar, Alert } from "@mui/material";

import { SeverityType } from "@/types/Alert";

type Props = {
  message: string | null;
  severity?: SeverityType;
  onClose: () => void;
  autoHideDuration?: number;
};

const AlertSnackbar: FC<Props> = (props) => {
  const {
    message,
    severity = "success",
    onClose,
    autoHideDuration = 3000,
  } = props;

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;

