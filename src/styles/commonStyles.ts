import { colors } from "@mui/material";

const commonStyles = {
  button: {
    height: 45,
    boxSizing: "border-box",
  },

  link: {
    cursor: "pointer",
    color: colors.green[300],
  },

  error: {
    cursor: "pointer",
    color: colors.red[500],
    "&:hover": {
      color: colors.red[300],
    },
  },

  iconInput: {
    cursor: "pointer",
    color: colors.green[500],
    "&:hover": {
      backgroundColor: "transparent",
      color: colors.green[300],
    },
    "&.Mui-disabled": {
      color: colors.grey[400],
    },
  },
};

export default commonStyles;

