"use client";

import { FC } from "react";

import { useRequest } from "ahooks";

import { CircularProgress, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

import styles from "./styles";

type Props = {
  onDelete: () => Promise<void>;
};

const DeleteButton: FC<Props> = (props) => {
  const { onDelete } = props;

  const { runAsync, loading: isLoading } = useRequest(onDelete, {
    manual: true,
  });

  const handleDelete = async () => {
    await runAsync();
  };

  return (
    <IconButton
      disabled={isLoading}
      sx={styles.iconButton}
      size="small"
      color="success"
      onClick={handleDelete}
    >
      {isLoading ? (
        <CircularProgress size={18} color="success" />
      ) : (
        <DeleteIcon />
      )}
    </IconButton>
  );
};

export default DeleteButton;

