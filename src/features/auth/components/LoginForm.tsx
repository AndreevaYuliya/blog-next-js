"use client";

import { FC, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { Formik } from "formik";
import { TextField } from "formik-mui";
import { object, string, InferType } from "yup";

import { logInUser } from "@/features/auth/services/userActions";
import { useAppDispatch } from "@/stores/store";
import { setUser } from "@/stores/slices/userSlice";
import routes from "@/config/navigation";
import { useAlertContext } from "@/contexts/AlertContext";

import { StyledField, StyledForm } from "@/styles/muiStyles";
import commonStyles from "@/styles/commonStyles";
import { isAxiosError } from "axios";
import { setAuthTokens } from "@/lib/auth/tokenStorage";

const LoginSchema = object({
  username: string()
    .matches(/^\S+$/, "Username cannot contain spaces")
    .min(3, "Username must be at least 3 characters long")
    .required("Required")
    .trim(),
  password: string()
    .matches(/\S/, "Password cannot be just whitespace")
    .min(6, "Password must be at least 6 characters long")
    .required("Required")
    .trim(),
});

const LoginForm: FC = () => {
  const { showAlert } = useAlertContext();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((prevValue) => !prevValue);

  const onSubmit = async (values: InferType<typeof LoginSchema>) => {
    try {
      const user = await logInUser(values);

      setAuthTokens(user.access_token, user.refresh_token);

      dispatch(setUser({ id: user.userId, username: user.userName }));

      router.push(routes.home);
    } catch (error: unknown) {
      let message = "Login failed. Please try again.";

      if (isAxiosError(error)) {
        message =
          (error.response?.data as { message?: string } | undefined)?.message ||
          error.message ||
          message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      showAlert(message, "error");
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, touched, errors, isValid, dirty }) => (
        <StyledForm>
          <StyledField
            component={TextField}
            name="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />

          <StyledField
            component={TextField}
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showPassword ? (
                    <Visibility
                      onClick={handleClickShowPassword}
                      sx={
                        touched.password && Boolean(errors.password)
                          ? commonStyles.error
                          : commonStyles.iconInput
                      }
                    />
                  ) : (
                    <VisibilityOff
                      onClick={handleClickShowPassword}
                      sx={
                        touched.password && Boolean(errors.password)
                          ? commonStyles.error
                          : commonStyles.iconInput
                      }
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isSubmitting || !isValid || !dirty}
            sx={commonStyles.button}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="success" />
            ) : (
              <Typography variant="button">Login</Typography>
            )}
          </Button>

          <Box>
            <Typography variant="subtitle2" component="span" marginRight={1}>
              Don&apos;t have an account?
            </Typography>

            <Link
              variant="button"
              sx={commonStyles.link}
              onClick={() => router.push(routes.register)}
            >
              Register
            </Link>
          </Box>
        </StyledForm>
      )}
    </Formik>
  );
};

export default LoginForm;
