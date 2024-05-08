const readJson = async (filepath) => {
    try {
        const response = await fetch('client_secret.json')

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        clientID = jsonData.web.client_id
        redirectURI = jsonData.web.redirect_uris[0]

        return {clientID, redirectURI}
    } catch (error) {
        console.log('Error fetching data:', error)
    }
}

const login = () => {
    let oauthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'

    let form = document.createElement('form')
    form.setAttribute('method', 'GET')
    form.setAttribute('action', oauthEndpoint)

    // const {clientID, redirectURI} = readJson('client_secret.json')

    const nonce = generateNonce();
    console.log(nonce)

    let params = {
        'client_id': '319171730755-9am4h7er5lonnf9gg1idi0sfk4p8opkd.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:3000',
        'response_type': 'token id_token',
        'scope': 'profile email',
        'state': 'pass-through-values',
        'nonce': nonce
    }
    //'include_granted_scopes': 'true',

    for (const p in params) {
        let input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', p)
        input.setAttribute('value', params[p])
        form.appendChild(input)
    }

    document.body.appendChild(form)

    form.submit()

}


const logout = () => {
    const accessToken = localStorage.getItem('idToken')

    if (!accessToken) {
        console.log('Access token not found in local storage.');
        return;
    }

    fetch('https://oauth2.googleapis.com/revoke?token=' + accessToken, {
        method: 'POST', headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .then((data) => {
            localStorage.removeItem('idToken')
            localStorage.removeItem('accessToken')
            location.href = 'http://localhost:3000/login.html'
        })
        .catch((error) => {
            console.log('Error revoking token:', error)
        })
}

const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const getJWT = () => {
    if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1)); // Remove the '#' and parse hash fragment
        const idToken = hashParams.get('id_token');
        console.log('User ID token:', idToken);

        const accessToken = hashParams.get('access_token');
        console.log('Access token:', accessToken);

        localStorage.setItem('idToken', idToken)
        localStorage.setItem('accessToken', accessToken)

        // window.history.pushState({}, document.title, '/' + 'index.html')

    } else {
        console.log('No hash fragment found in location.hash');
    }
}

document.getElementById('auth_button').addEventListener('click', login)

let token = localStorage.getItem('idToken');

const create_button = (name, listener) => {
    let button = document.createElement('button');
    button.textContent = name;
    button.className = 'button button-wrap';
    button.addEventListener('click', listener)
    return button;
};

/*
const makeRequest = (endpoint, successCallback, data = null, method = "GET") => {
    let url = `/api/${endpoint}`;
    const fetchOptions = {
        method, headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
        }, body: method !== "GET" ? JSON.stringify(data) : null
    };
    if (method === "GET" && data) {
        const queryParams = new URLSearchParams(data).toString();
        url += '?' + queryParams;
    }
    fetch(url, fetchOptions)
        .then(data => data.json())
        .then(json_data => successCallback(json_data))
        .catch(err => {
            //TODO: nice error display to usr
            console.log(err)
        });
};
*/

let bb = document.getElementById('button_box');

bb.appendChild(create_button("mode swap", () => {
    const classList = document.getElementById("html").classList;
    classList.toggle("dark");
    classList.toggle("light");
}))

if (token !== null) {
    let crawl_data_button = create_button("crawl data", () => makeRequest("crawledData", data => console.log(data), {domain_id: 1}));
    let domain_button = create_button("domains", () => makeRequest("domain", data => console.log(data)));
    let crawl_add_button = create_button("crawl", () => makeRequest("crawledData/crawl", data => console.log(data), {
        domain_id: 1
    }, "POST"));
    let crawl_see_button = create_button("crawl see", () => makeRequest("crawledData/xml", data => console.log(data), {
        domain_id: 1
    }, "POST"));
    let add_domain_button = create_button("add domain", () => makeRequest("domain/add", data => console.log(data), {domain_url: "www.google.com"}, "POST"));


    bb.appendChild(crawl_data_button)
    bb.appendChild(domain_button)
    bb.appendChild(crawl_add_button)
    bb.appendChild(crawl_see_button)
    bb.appendChild(add_domain_button)

}
