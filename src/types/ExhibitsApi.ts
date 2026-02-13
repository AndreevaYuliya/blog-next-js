import { GetUserResponse } from "./UserApi";

export type GetExhibitResponse = {
  id: number;
  imageUrl: string;
  description: string;
  user: GetUserResponse;
  commentCount: number;
  createdAt: string;
};

export type GetExhibitsResponse = {
  data: GetExhibitResponse[];
  total: number;
  page: number;
  lastPage: number;
};

export type CreateExhibitResponse = {
  imageUrl: string;
  description: string;
  userId: number;
  id: number;
  commentCount: number;
  createdAt: string;
};

export type DeleteExhibitParams = {
  id: string;
};

