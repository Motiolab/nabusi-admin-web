const LOCAL_STORAGE_REDIRECT_URL_AFTER_LOGIN = 'redirectUrlAfterLogin';

export const setRedirectUrlAfterLogin = (url: string | 'undefined') => {
    localStorage.setItem(LOCAL_STORAGE_REDIRECT_URL_AFTER_LOGIN, url);
};

export const getRedirectUrlAfterLogin = () => {
    const redirectUrlAfterLogin = localStorage.getItem(LOCAL_STORAGE_REDIRECT_URL_AFTER_LOGIN);
    if (redirectUrlAfterLogin === 'undefined' || !redirectUrlAfterLogin) return null;
    return redirectUrlAfterLogin;
};

export { LOCAL_STORAGE_REDIRECT_URL_AFTER_LOGIN };
