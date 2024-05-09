import {makeRequest} from "../utils.js";

export async function historyPage(contentElement) {
    const domains = await makeRequest("domain");
    // Remove other content
    contentElement.replaceChildren();
    // contentElement.children.clear();
    let domainContainer = document.createElement("div");
    domainContainer.classList.add("domain-container");
    // Populate list
    await populateData(domains, domainContainer);

    contentElement.appendChild(domainContainer);
    contentElement.className = '';
    contentElement.classList.add('history-page');
}


const populateData = async (domains, domainContainer) => {
    const list = document.createElement("ul")
    domainContainer.appendChild(list);

    if (domains.length === 0) {
        const userMessage = document.createElement("p")
        userMessage.classList.add("user-message")
        userMessage.textContent = "You have no history 	¯\\(o_o)/¯"
        domainContainer.appendChild(userMessage)
        return
    }
    domains
        .forEach(domain => list.appendChild(createCard(domain)));
};

const cardClick = async (domain_id) => {
    // console.log(`Clicked on ${object.domain_id}`)

    const existingPopup = document.querySelector(".popup")
    if (existingPopup) {
        existingPopup.remove()
    }

    let crawledData = await makeRequest("crawledData", {domain_id});

    const popup = document.createElement("dialog")
    // popup.classList.add("popup")

    const closeButton = document.createElement("button")
    closeButton.classList.add("close-button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        popup.close()
    });

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.close();
        }
    })

    popup.appendChild(closeButton);


    crawledData.forEach(cdi => populateCrawlData(cdi, popup))
    document.body.appendChild(popup)

    popup.showModal()

};

let populateCrawlData = (scrapedURL, popup) => {
    const scrapedURLText = document.createElement("p")
    scrapedURLText.textContent = `URL: ${scrapedURL.url}`

    const scrapedURLCount = document.createElement("p")
    scrapedURLCount.textContent = `count: ${scrapedURL.count}`
    scrapedURLCount.style.marginBottom = "0.5em"

    popup.appendChild(scrapedURLText)
    popup.appendChild(scrapedURLCount)
};

function createCard(domain) {
    const card = document.createElement("div")
    card.classList.add("card")

    const url = document.createElement("p")
    url.textContent = `URL: ${domain.url}`

    const timeUpdated = document.createElement("p")
    const date = new Date(domain.timelastupdated)
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }
    timeUpdated.textContent = `Last Updated: ${date.toLocaleDateString('en-US', options)}`
    card.appendChild(url)
    card.appendChild(timeUpdated)

    card.addEventListener("click", () => cardClick(domain.domain_id));

    return card;
}
