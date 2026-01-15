let accessToken = null;
let csrfToken = null;

export const setAuthTokens = (tokens = {}) => {
  accessToken = tokens.accessToken || null;
  csrfToken = tokens.csrfToken || null;
};

export const clearAuthTokens = () => {
  accessToken = null;
  csrfToken = null;
};

export const getAccessToken = () => accessToken;
export const getCsrfToken = () => csrfToken;
