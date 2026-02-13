import axiosInstance from "@/lib/api/axios";

import {
  RegisterUserParams,
  RegisterUserResponse,
  LogInUserParams,
  LogInUserResponse,
  GetUserResponse,
} from "@/types/UserApi";

import {
  AUTH_LOGIN_URL,
  AUTH_ME_URL,
  AUTH_REGISTER_URL,
} from "@/config/constants/client";

export const registerUser = async (
  params: RegisterUserParams,
): Promise<RegisterUserResponse> => {
  const userData = await axiosInstance.post(AUTH_REGISTER_URL, params);

  return userData.data;
};

export const logInUser = async (
  params: LogInUserParams,
): Promise<LogInUserResponse> => {
  const userData = await axiosInstance.post(AUTH_LOGIN_URL, params);

  return userData.data;
};

export const logOutUser = async () => {
  await axiosInstance.post("/api/auth/logout");
};

export const getUser = async (): Promise<GetUserResponse | null> => {
  const userData = await axiosInstance.get<GetUserResponse>(AUTH_ME_URL);

  return userData.data;
};

