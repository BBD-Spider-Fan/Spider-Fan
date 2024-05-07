export const loginUrl = () => {
    const oauthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    const params = new URLSearchParams({
        client_id: '319171730755-9am4h7er5lonnf9gg1idi0sfk4p8opkd.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/authorized.html',
        response_type: 'token id_token',
        scope: 'profile email',
        state: 'pass-through-values',
        nonce: generateNonce()
    });
    return `${oauthEndpoint}?${params}`;
}

export const authUrlRipper = () => {
    // Url ripper pull out the url fragment.
    if (!location.hash) return;
    const hashParams = new URLSearchParams(location.hash.substring(1));
    window.history.pushState(null, document.title, '/');
    const idToken = hashParams.get('id_token');
    localStorage.setItem('idToken', idToken);
};

const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
