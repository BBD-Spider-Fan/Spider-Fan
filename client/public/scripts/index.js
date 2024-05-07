const logout = () => {
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken) {
        console.log("Access token not found in local storage.");
        return;
    }

    fetch("https://oauth2.googleapis.com/revoke?token=" + accessToken,{
        method: 'POST', 
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    .then((data) => {
        localStorage.removeItem("idToken")
        localStorage.removeItem("accessToken")
        location.href = "http://localhost:5500/login.html"
    })
    .catch((error) => {
        console.log("Error revoking token:", error)
    })
}

const getJWT = () => {
    if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const idToken = hashParams.get('id_token');
        console.log("User ID token:", idToken);

        const accessToken = hashParams.get('access_token');
        console.log("Access token:", accessToken);

        localStorage.setItem('idToken', idToken)
        localStorage.setItem('accessToken', accessToken)

        // window.history.pushState({}, document.title, "/" + "index.html")

        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then((data) => data.json())
        .then((info) => {
            console.log(info)
            console.log(info.name)
    })

    } else {
        console.log("No hash fragment found in location.hash");
    }
}