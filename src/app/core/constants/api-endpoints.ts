export const API_BASE_URL = 'http://127.0.0.1:4000/api';
export const IS_DEVELOPMENT = true;

export const USERS_URL = `${API_BASE_URL}/users`;

export const ROLES_URL = `${API_BASE_URL}/roles`;

export const LOGIN_URL = `${API_BASE_URL}/login`;
export const LOGOUT_URL = `${API_BASE_URL}/logout`;
export const CHANGE_PASSWORD_URL = `${USERS_URL}/change-password`;
export const FORGET_PASSWORD_URL = `${USERS_URL}/forget-password`;
export const RESET_PASSWORD_URL = `${USERS_URL}/reset-password`;

export const NOTIFICATION_HUB_URL = `http://localhost:9999/notificationHub`;

export const NOTIFICATION_URL = `${API_BASE_URL}/notifications`;
export const NOTIFICATION_STATUS_URL = `${API_BASE_URL}/notifications/status`;
export const MARK_NOTIFICATION_URL = `${API_BASE_URL}/notifications/mark-as-read`;

export const VALIDATION_RULES_URL = `${API_BASE_URL}/field-validation-rules/validation-rules`;
export const DATE_TIME_URL = `${API_BASE_URL}/date-time`;
export const RESTAURANTS_URL = `${API_BASE_URL}/restaurants`;
export const STOCKS_URL = `${API_BASE_URL}/stocks`;
