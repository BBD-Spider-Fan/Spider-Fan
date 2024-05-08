const makeRequest = (token, endpoint, successCallback, data = null, method = "GET") => {
    let url = `http://localhost:3000/api/${endpoint}`;
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

const getDomains = () => {
    const idToken = localStorage.getItem('idToken')

    if (!idToken) {
        console.log('ID token not found in local storage.')
        return
    }
    else {
        console.log(idToken)
    }

    makeRequest(idToken, "domain", data => {
        const container = document.getElementById("domain-container")

        container.innerHTML = '';

        const list = document.createElement("ul")

        data.forEach(object => {
            const card = document.createElement("div")
            card.classList.add("card")

            const url = document.createElement("p")
            url.textContent = `URL: ${object.url}`

            const timeUpdated = document.createElement("p")
            const date = new Date(object.timelastupdated)
            const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'}

            timeUpdated.textContent = `Last Updated: ${date.toLocaleDateString('en-US', options)}`

            card.appendChild(url)
            card.appendChild(timeUpdated)

            card.addEventListener("click", () => {
                const mainContainer = document.getElementById("main-container")
                console.log(`Clicked on ${object.domain_id}`)

                const existingPopup = document.querySelector(".popup")
                if (existingPopup) {
                    existingPopup.remove()
                }

                makeRequest(idToken, "crawledData", data => {
                    console.log(data)

                    const popup = document.createElement("div")
                    popup.classList.add("popup")

                    const closeButton = document.createElement("button")
                    closeButton.classList.add("close-button");
                    closeButton.textContent = "Close"
                    closeButton.addEventListener("click", () => {
                        popup.remove()
                    })

                    popup.appendChild(closeButton)

                    data.forEach(scrapedURL => {
                        const scrapedURLText = document.createElement("p")
                        scrapedURLText.textContent = `URL: ${scrapedURL.url}`

                        const scrapedURLCount = document.createElement("p")
                        scrapedURLCount.textContent = `count: ${scrapedURL.count}`
                        scrapedURLCount.style.marginBottom = "0.5em"

                        popup.appendChild(scrapedURLText)
                        popup.appendChild(scrapedURLCount)
                    })

                    document.body.appendChild(popup) 
                }, {domain_id: object.domain_id})
            })
            container.appendChild(card)
        })
    })
}