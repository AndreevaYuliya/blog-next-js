export type Comment = {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
};

export type GetCommentsParams = {
  exhibitId: string;
};

export type GetCommentsResponse = Comment[];

export type CreateCommentParams = {
  exhibitId: string;
  body: {
    text: string;
  };
};

export type CreateCommentResponse = Comment;

export type DeleteCommentParams = {
  exhibitId: string;
  commentId: string;
};

export type DeleteCommentResponse = {
  id: string;
  message: string;
};

