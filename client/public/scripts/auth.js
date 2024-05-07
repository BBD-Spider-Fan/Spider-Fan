const login = () => {
    let oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"

    let form = document.createElement('form')
    form.setAttribute('method', 'GET')
    form.setAttribute('action', oauthEndpoint)

    const nonce = generateNonce();
    console.log(nonce)

    let params = {
        "client_id": "319171730755-9am4h7er5lonnf9gg1idi0sfk4p8opkd.apps.googleusercontent.com",
        "redirect_uri": "http://localhost:3001/",
        "response_type": "token id_token",
        "scope": "profile email",
        "state": "pass-through-values",
        "nonce": nonce
    }

    for (var p in params){
        let input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', p)
        input.setAttribute('value', params[p])
        form.appendChild(input)
    }

    document.body.appendChild(form)

    form.submit()

}

const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

document.getElementById("auth-button").addEventListener("click", login)