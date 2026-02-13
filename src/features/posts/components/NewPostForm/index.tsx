"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";

import { Button, CircularProgress, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

import { Formik } from "formik";
import { TextField } from "formik-mui";
import { mixed, object, string } from "yup";

import routes from "@/config/navigation";
import { createExhibit } from "@/features/posts/services/exhibitActions";
import { useAlertContext } from "@/contexts/AlertContext";

import { StyledField } from "@/styles/muiStyles";
import commonStyles from "@/styles/commonStyles";

import { StyledForm, VisuallyHiddenInput } from "./styles";

const PostSchema = object({
  image: mixed().required("Image file is required"),
  description: string()
    .matches(/\S/, "Description cannot be just whitespace")
    .min(100, "Description must be at least 100 characters")
    .required("Description is required")
    .trim(),
});

const NewPostForm: FC = () => {
  const router = useRouter();

  const { showAlert } = useAlertContext();

  const onSubmit = async (values: {
    image: File | null;
    description: string;
  }) => {
    try {
      if (!values.image) {
        showAlert("Image file is required.", "error");

        return;
      }

      const postData = new FormData();

      postData.append("image", values.image);
      postData.append("description", values.description);

      await createExhibit(postData);

      showAlert("Post created successfully", "success");

      router.push(routes.home);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message || "Failed to create post"
          : "Failed to create post. Please try again.";

      showAlert(message, "error");
    }
  };

  return (
    <Formik
      initialValues={{ image: null as File | null, description: "" }}
      validationSchema={PostSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        dirty,
        isSubmitting,
        isValid,
        submitForm,
        setFieldValue,
      }) => (
        <StyledForm>
          <Button
            component="label"
            role={"button"}
            variant="contained"
            color="success"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={commonStyles.button}
          >
            <Typography>Upload files</Typography>

            <VisuallyHiddenInput
              type="file"
              name="image"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.currentTarget.files?.[0] || null;
                setFieldValue("image", file);
              }}
            />
          </Button>

          {values.image && (
            <Typography variant="body2">
              Selected: {(values.image as File).name}
            </Typography>
          )}

          <StyledField
            component={TextField}
            name="description"
            type="text"
            label="Description"
            placeholder="Enter description"
            multiline
            rows={20}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isSubmitting || !isValid || !dirty}
            sx={commonStyles.button}
            onClick={submitForm}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="success" />
            ) : (
              <Typography variant="button">Save</Typography>
            )}
          </Button>
        </StyledForm>
      )}
    </Formik>
  );
};

export default NewPostForm;

