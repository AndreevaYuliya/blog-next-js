export const AUTH_REGISTER_URL = "/api/auth/register";

export const AUTH_LOGIN_URL = "/api/auth/login";
export const AUTH_ME_URL = "/api/auth/me";
export const AUTH_LOGOUT_URL = "/api/auth/logout";

export const EXHIBITS_URL = "/api/exhibits";
export const EXHIBIT_BY_ID_URL = (id: string) => `/api/exhibits/${id}`;
export const MY_POSTS_URL = "/api/exhibits/my-posts";

export const COMMENTS_URL = (exhibitId: string) =>
  `/api/exhibits/${exhibitId}/comments`;

export const DELETE_COMMENT_URL = (exhibitId: string, commentId: string) =>
  `/api/exhibits/${exhibitId}/comments/${commentId}`;

