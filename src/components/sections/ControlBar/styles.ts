import { colors } from "@mui/material";

const styles = {
  headerContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    boxSizing: "border-box",
    color: colors.common.white,
    cursor: "pointer",
    userSelect: "none",
    zIndex: 999,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    backgroundColor: colors.green[500],
    boxShadow: `0 2px 5px ${colors.green[300]}`,
    padding: "0 16px",
  },

  titleContainer: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "56px !important",
    boxSizing: "border-box",
  },

  title: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },

  menuButtonContainer: {
    flexGrow: 0,
    width: "fit-content",
    display: {
      xs: "flex",
      md: "none",
    },
    "& button:hover": {
      backgroundColor: colors.green[700],
    },
  },

  menuContainer: {
    display: {
      xs: "flex",
      md: "none",
    },
  },

  buttonsContainer: {
    flexGrow: 0,
    width: "fit-content",
    display: {
      xs: "none",
      md: "flex",
    },
    gap: {
      xs: "none",
      md: 2,
    },
  },

  userContainer: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "default",
    gap: 1,
    color: colors.common.white,
  },

  navButton: (isActive: boolean) => ({
    my: 2,
    color: "white",
    display: "block",
    ...(isActive ? { backgroundColor: colors.green[300] } : null),
    "&:hover": { backgroundColor: colors.green[700] },
  }),

  icon: {
    "&:hover": {
      backgroundColor: colors.green[700],
    },
  },
  divider: {
    bgcolor: colors.common.white,
  },
};

export default styles;

