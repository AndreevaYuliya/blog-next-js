"use client";

import { FC, useState } from "react";

import { useRequest } from "ahooks";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

import { getComments } from "@/features/comments/services/commentsActions";
import NewCommentForm from "@/features/comments/components/NewCommentForm";
import Comment from "@/features/comments/components/Comment";

import { useAppSelector } from "@/stores/store";
import { useAlertContext } from "@/contexts/AlertContext";

import styles from "./styles";

type Props = {
  postId: string;
  commentCount: number;
};

const CommentStripe: FC<Props> = (props) => {
  const { postId, commentCount } = props;

  const [expanded, setExpanded] = useState(false);

  const { showAlert } = useAlertContext();

  const {
    runAsync: runGetComments,
    data: comments,
    mutate: mutateComments,
    loading: isLoading,
  } = useRequest(() => getComments({ exhibitId: postId }), {
    manual: true,
  });

  const isAuth = Boolean(useAppSelector((s) => s.user.user));

  const isDisabled = isLoading;

  const displayCount = comments?.length ?? commentCount;

  const handleChange = async (_: unknown, isExpanded: boolean) => {
    if (!isExpanded) {
      setExpanded(false);

      return;
    }

    try {
      await runGetComments();
    } catch {
      showAlert("Failed to load comments", "error");
    } finally {
      setExpanded(true);
    }
  };

  return (
    <Box sx={styles.container}>
      <Accordion
        disabled={isDisabled}
        sx={styles.accordion}
        expanded={expanded}
        onChange={handleChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="success" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" color="success">
            <strong>Comments:</strong> {displayCount}
          </Typography>
        </AccordionSummary>

        <Box sx={styles.accordionDetailsContainer}>
          {comments?.map((comment, index) => (
            <AccordionDetails
              key={comment.id}
              sx={styles.commentItem(index === comments.length - 1)}
            >
              <Comment
                {...comment}
                exhibitId={postId}
                mutateComments={mutateComments}
              />
            </AccordionDetails>
          ))}
        </Box>

        {isAuth && (
          <Box sx={styles.formContainer}>
            <NewCommentForm postId={postId} mutateComments={mutateComments} />
          </Box>
        )}
      </Accordion>
    </Box>
  );
};

export default CommentStripe;

