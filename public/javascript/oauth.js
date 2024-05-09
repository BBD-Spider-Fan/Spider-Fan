import {makeRequest} from "./utils.js";

export const loginUrl = () => {
    const oauthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    const params = new URLSearchParams({
        client_id: '319171730755-9am4h7er5lonnf9gg1idi0sfk4p8opkd.apps.googleusercontent.com',
        redirect_uri: 'http://ec2-34-242-195-212.eu-west-1.compute.amazonaws.com/',
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

export const isLoggedIn = async () => {
    // Make call to ensure that the user is logged in.
    return await makeRequest("auth").then(d => !("error" in d));
};

export const logout = () => {
    const accessToken = localStorage.getItem('idToken');

    if (!accessToken) {
        console.log('Access token not found in local storage.');
        return;
    }

    fetch('https://oauth2.googleapis.com/revoke?token=' + accessToken, {
        method: 'POST', headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .then(() => {
            localStorage.removeItem('idToken');
            location.reload();
        })
        .catch((error) => {
            console.log('Error revoking token:', error);
        });
}

