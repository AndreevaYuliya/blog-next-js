"use client";

import { FC, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  CircularProgress,
  colors,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { Formik } from "formik";
import { TextField } from "formik-mui";
import { object, string, InferType, ref } from "yup";

import { logInUser, registerUser } from "@/features/auth/services/userActions";
import { useAppDispatch } from "@/stores/store";
import { setUser } from "@/stores/slices/userSlice";
import { useAlertContext } from "@/contexts/AlertContext";
import routes from "@/config/navigation";

import { StyledField, StyledForm } from "@/styles/muiStyles";
import commonStyles from "@/styles/commonStyles";

const RegisterSchema = object({
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
  confirmPassword: string()
    .oneOf([ref("password"), ""], "Passwords must match")
    .required("Required"),
});

const RegisterForm: FC = () => {
  const router = useRouter();

  const { showAlert } = useAlertContext();

  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevValue) => !prevValue);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prevValue) => !prevValue);
  };

  const onSubmit = async (values: InferType<typeof RegisterSchema>) => {
    try {
      const userData = {
        username: values.username,
        password: values.password,
      };

      await registerUser(userData);

      const login = await logInUser(userData);

      showAlert("Registration successful", "success");

      dispatch(setUser({ id: login.userId, username: login.userName }));

      router.push(routes.home);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message || "Registration failed. Please try again."
          : "Registration failed. Please try again.";

      showAlert(message, "error");
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isSubmitting, touched, errors, isValid, dirty }) => (
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

          <StyledField
            component={TextField}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            placeholder="Confirm your password"
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showConfirmPassword ? (
                    <Visibility
                      onClick={handleClickShowConfirmPassword}
                      sx={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                          ? commonStyles.error
                          : commonStyles.iconInput
                      }
                    />
                  ) : (
                    <VisibilityOff
                      onClick={handleClickShowConfirmPassword}
                      sx={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
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
            sx={commonStyles.button}
            disabled={isSubmitting || !isValid || !dirty}
            onClick={submitForm}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="success" />
            ) : (
              <Typography variant="button">Register</Typography>
            )}
          </Button>

          <Box>
            <Typography
              variant="body2"
              component="span"
              marginRight={1}
              color={colors.grey[700]}
            >
              Already have an account?
            </Typography>

            <Link
              variant="button"
              sx={commonStyles.link}
              onClick={() => router.push(routes.login)}
            >
              Login
            </Link>
          </Box>
        </StyledForm>
      )}
    </Formik>
  );
};

export default RegisterForm;

