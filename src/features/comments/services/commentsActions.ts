import axiosInstance from "@/lib/api/axios";

import {
  GetCommentsParams,
  GetCommentsResponse,
  CreateCommentParams,
  CreateCommentResponse,
  DeleteCommentParams,
  DeleteCommentResponse,
} from "@/types/CommentsApi";

import { COMMENTS_URL, DELETE_COMMENT_URL } from "@/config/constants/client";

export const getComments = async (
  params: GetCommentsParams,
): Promise<GetCommentsResponse> => {
  const exhibitData = await axiosInstance.get<GetCommentsResponse>(
    COMMENTS_URL(params.exhibitId),
  );

  return exhibitData.data;
};

export const createComment = async (
  params: CreateCommentParams,
): Promise<CreateCommentResponse> => {
  const exhibitData = await axiosInstance.post<CreateCommentResponse>(
    COMMENTS_URL(params.exhibitId),
    params.body,
  );

  return exhibitData.data;
};

export const deleteComment = async (
  params: DeleteCommentParams,
): Promise<DeleteCommentResponse> => {
  const deleteCommentData = await axiosInstance.delete<DeleteCommentResponse>(
    DELETE_COMMENT_URL(params.exhibitId, params.commentId),
  );

  return deleteCommentData.data;
};

