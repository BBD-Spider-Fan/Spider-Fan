const getDomains = () => {
    const idToken = localStorage.getItem('idToken')

    if (!idToken) {
        console.log('ID token not found in local storage.')
        return
    }
    else {
        console.log(idToken)
    }

    fetch("http://localhost:3000/api/domain/", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    }).then(data => {
        console.log("Data: ", data)

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

                fetch("http://localhost:3000/api/domain/", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok")
                    }
                    return response.json()
                }).then(data => {
                    console.log("Data: ", data)
                }).catch(error => {
                    console.error("There was a problem with the fetch operation:", error)
                })

                const existingPopup = document.querySelector(".popup")
                if (existingPopup) {
                    existingPopup.remove()
                }

                const popup = document.createElement("div")
                popup.classList.add("popup")

                const popupContent = document.createElement("p")
                popupContent.textContent = `Domain ID: ${object.domain_id}`

                const closeButton = document.createElement("button")
                closeButton.classList.add("close-button");
                closeButton.textContent = "Close"
                closeButton.addEventListener("click", () => {
                    popup.remove()
                })

                popup.appendChild(closeButton)
                popup.appendChild(popupContent)
                document.body.appendChild(popup)                
            })

            container.appendChild(card)
        }) 
    }).catch(error => {
        console.error("There was a problem with the fetch operation:", error)
    })
}