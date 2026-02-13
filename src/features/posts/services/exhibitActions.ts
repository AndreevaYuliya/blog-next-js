import axiosInstance from "@/lib/api/axios";

import {
  CreateExhibitResponse,
  DeleteExhibitParams,
  GetExhibitResponse,
  GetExhibitsResponse,
} from "@/types/ExhibitsApi";

import {
  EXHIBITS_URL,
  EXHIBIT_BY_ID_URL,
  MY_POSTS_URL,
} from "@/config/constants/client";

export const getExhibits = async (
  page: number,
  limit: number,
): Promise<GetExhibitsResponse | null> => {
  const exhibitData = await axiosInstance.get<GetExhibitsResponse>(
    `${EXHIBITS_URL}?page=${page}&limit=${limit}`,
  );

  return exhibitData.data;
};

export const getExhibitById = async (
  id: string,
): Promise<GetExhibitResponse> => {
  const exhibitData = await axiosInstance.get<GetExhibitResponse>(
    EXHIBIT_BY_ID_URL(id),
  );

  return exhibitData.data;
};

export const getMyPosts = async (
  page: number,
  limit: number,
): Promise<GetExhibitsResponse | null> => {
  const exhibitData = await axiosInstance.get<GetExhibitsResponse>(
    `${MY_POSTS_URL}?page=${page}&limit=${limit}`,
  );

  return exhibitData.data;
};

export const createExhibit = async (
  formData: FormData,
): Promise<CreateExhibitResponse> => {
  const exhibitData = await axiosInstance.post<CreateExhibitResponse>(
    EXHIBITS_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return exhibitData.data;
};

export const deleteExhibit = async (params: DeleteExhibitParams) => {
  await axiosInstance.delete(EXHIBIT_BY_ID_URL(params.id));
};

