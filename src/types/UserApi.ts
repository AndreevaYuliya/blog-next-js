export type GetUserResponse = {
  id: number;
  username: string;
};

export type RegisterUserParams = {
  username: string;
  password: string;
};

export type RegisterUserResponse = {
  id: number;
  username: string;
};

export type LogInUserParams = {
  username: string;
  password: string;
};

export type LogInUserResponse = {
  access_token: string;
  refresh_token: string;
  userId: number;
  userName: string;
};
