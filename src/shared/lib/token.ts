const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'X-Nabusi-Admin-Or-App-Member-Json-String';
const LOCAL_STORAGE_REFRESH_TOKEN_KEY = 'X-Nabusi-Admin-Or-App-Member-Refresh-Token';

export const setLocalAccessToken = (accessToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
};

export const setLocalRefreshToken = (refreshToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken);
};

export const removeLocalAccessToken = () => {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
};

export const removeLocalRefreshToken = () => {
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
};

export const getLocalAccessToken = () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    if (accessToken === 'undefined' || !accessToken) return null;
    return accessToken;
};

export const getLocalRefreshToken = () => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
    if (refreshToken === 'undefined' || !refreshToken) return null;
    return refreshToken;
};

export const updateLocalAccessToken = (newAccessToken: string) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    if (accessToken === 'undefined' || !accessToken) return setLocalAccessToken(newAccessToken);
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, newAccessToken);
};

export { LOCAL_STORAGE_ACCESS_TOKEN_KEY };
