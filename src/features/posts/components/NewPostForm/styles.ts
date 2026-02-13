import { Form } from "formik";
import { styled } from "@mui/material/styles";

export const StyledForm = styled(Form)({
  display: "flex",
  flexDirection: "column",
  gap: 15,
  boxSizing: "border-box",
  borderRadius: 10,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
  padding: 20,
  width: "85%",
  marginTop: 50,
});

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

