import { ElementType } from "react";

import { Field, Form } from "formik";
import { colors, MenuItem, MenuItemProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledForm = styled(Form)({
  display: "flex",
  flexDirection: "column",
  gap: 15,
  boxSizing: "border-box",
  borderRadius: 10,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
  padding: 20,
  width: 340,
  marginTop: 50,
});

export const StyledField = styled(Field)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: colors.green[500],
    },
    "&:hover fieldset": {
      borderColor: colors.green[300],
      borderWidth: 2,
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.green[700],
      borderWidth: 2,
    },
    "&.Mui-error fieldset": {
      borderColor: colors.red[300],
    },
    "&.Mui-error.Mui-focused fieldset": {
      borderColor: colors.red[700],
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: colors.green[700],
  },
  "& input:valid:focus:hover + fieldset": {
    borderColor: colors.green[300],
  },
  "&:hover .MuiInputLabel-root.Mui-focused": {
    color: colors.green[300],
  },
  "& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.red[300],
    borderWidth: 2,
  },
  "& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline":
    {
      borderColor: colors.red[700],
    },
  "& .MuiInputLabel-root.Mui-error.Mui-focused": {
    color: colors.red[700],
  },
  "& .MuiOutlinedInput-root.Mui-error.Mui-focused:hover .MuiOutlinedInput-notchedOutline":
    {
      borderColor: colors.red[300],
    },
  "&:hover .MuiInputLabel-root.Mui-error.Mui-focused": {
    color: colors.red[300],
  },
});

type StyledMenuItemProps = MenuItemProps & {
  component?: ElementType;
  href?: string;
};

export const StyledMenuItem = styled(MenuItem)<StyledMenuItemProps>({
  "&.Mui-selected": {
    backgroundColor: colors.green[500],
  },
  "&.Mui-selected:hover": {
    backgroundColor: colors.green[300],
  },
  "&:hover": {
    backgroundColor: colors.green[300],
  },
});

