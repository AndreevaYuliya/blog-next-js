"use client";

import { FC } from "react";

import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { Send as SendIcon } from "@mui/icons-material";

import { TextField } from "formik-mui";
import { Form, Formik } from "formik";
import { object, string } from "yup";

import { GetCommentsResponse } from "@/types/CommentsApi";
import { useAppSelector } from "@/stores/store";
import { useAlertContext } from "@/contexts/AlertContext";
import { createComment } from "@/features/comments/services/commentsActions";

import { StyledField } from "@/styles/muiStyles";
import commonStyles from "@/styles/commonStyles";

import styles from "./styles";

type Props = {
  postId: string;
  mutateComments: (
    updateComments: (prev?: GetCommentsResponse) => GetCommentsResponse,
  ) => void;
};

const CommentSchema = object({
  comment: string().matches(/\S/, "Comment cannot be just whitespace").trim(),
});

const NewCommentForm: FC<Props> = (props) => {
  const { postId, mutateComments } = props;

  const currentUser = useAppSelector((s) => s.user.user?.username);

  const { showAlert } = useAlertContext();

  const handleSubmit = async (
    values: { comment: string },
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      const commentData = {
        exhibitId: postId,
        body: {
          text: values.comment,
        },
      };

      const newComment = await createComment(commentData);

      mutateComments((prev) => [...(prev ?? []), newComment]);

      showAlert("Comment added", "success");

      resetForm();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message || "Failed to create comment"
          : "Failed to create comment. Please try again.";

      showAlert(message, "error");
    }
  };

  return (
    <Formik
      initialValues={{ comment: "" }}
      validationSchema={CommentSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
    >
      {({ submitForm, isSubmitting, touched, errors, isValid, dirty }) => (
        <Form>
          <Box sx={styles.inputContainer}>
            <Avatar sx={styles.avatar}>
              {currentUser?.[0]?.toUpperCase()}
            </Avatar>

            <StyledField
              component={TextField}
              name="comment"
              type="text"
              placeholder="Write your comment here..."
              error={touched.comment && Boolean(errors.comment)}
              helperText={touched.comment && errors.comment}
              multiline
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      disabled={isSubmitting || !isValid || !dirty}
                      sx={commonStyles.iconInput}
                      onClick={async () => {
                        await submitForm();
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="success" />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default NewCommentForm;

