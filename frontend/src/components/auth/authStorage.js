export const AUTH_TOKEN_KEY = "upchar_token";
export const AUTH_USER_KEY = "upchar_user";
export const ADMIN_AUTH_TOKEN_KEY = "upchar_admin_token";
export const ADMIN_AUTH_USER_KEY = "upchar_admin_user";

export function safeParseUser(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("riclab_user");
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_AUTH_USER_KEY);
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    return null;
  }
}

export function getStoredUser() {
  return safeParseUser(localStorage.getItem(AUTH_USER_KEY));
}

export function storeAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredAdminUser() {
  return safeParseUser(localStorage.getItem(ADMIN_AUTH_USER_KEY));
}

export function hasAdminSession() {
  const user = getStoredAdminUser();
  return Boolean(localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) && user?.role === "admin");
}

export function storeAdminAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(ADMIN_AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function clearAdminAuthSession() {
  localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_AUTH_USER_KEY);
}
