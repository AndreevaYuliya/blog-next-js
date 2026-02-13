import "server-only";

const BASE_URL = process.env.API_BASE_URL;

if (!BASE_URL) {
  throw new Error("API_BASE_URL is not set");
}

export const LOGIN_URL = `${BASE_URL}/api/auth/login`;
export const REGISTER_URL = `${BASE_URL}/users/register`;
export const USER_PROFILE_URL = `${BASE_URL}/users/my-profile`;

export const EXHIBITS_URL = `${BASE_URL}/api/exhibits`;
export const EXHIBIT_BY_ID_URL = (id: string) => `${EXHIBITS_URL}/${id}`;
export const MY_POSTS_URL = `${EXHIBITS_URL}/my-posts`;

export const COMMENTS_URL = (exhibitId: string) =>
  `${BASE_URL}/api/exhibits/${exhibitId}/comments`;
export const DELETE_COMMENT_URL = (exhibitId: string, commentId: string) =>
  `${BASE_URL}/api/exhibits/${exhibitId}/comments/${commentId}`;

