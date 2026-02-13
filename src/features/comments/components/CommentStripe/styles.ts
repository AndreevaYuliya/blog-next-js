import { colors } from "@mui/material";

const styles = {
  container: {
    alignItems: "end",
    marginTop: 10,
  },

  accordion: {
    backgroundColor: colors.green[50],
  },

  accordionDetailsContainer: {
    maxHeight: 250,
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  commentItem: (isLast: boolean) => ({
    borderTop: `1px solid ${colors.green[700]}`,
    borderBottom: isLast ? `1px solid ${colors.green[700]}` : "none",
  }),

  formContainer: {
    position: "sticky",
    bottom: 0,
    backgroundColor: colors.common.white,
  },
};

export default styles;

