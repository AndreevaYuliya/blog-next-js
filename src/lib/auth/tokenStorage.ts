const ACCESS = "access_token";
const REFRESH = "refresh_token";

export const getAccessToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(ACCESS);

export const getRefreshToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(REFRESH);

export const setAuthTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS, access);
  localStorage.setItem(REFRESH, refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
};

