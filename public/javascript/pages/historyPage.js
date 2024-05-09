import {makeRequest} from "../utils.js";

export async function historyPage(contentElement) {
    // Remove other content
    contentElement.replaceChildren();
    // contentElement.children.clear();
    let domainContainer = document.createElement("div");
    domainContainer.classList.add("domain-container");
    // Populate list
    await populateData(domainContainer);

    contentElement.appendChild(domainContainer);
}


const populateData = async (domainContainer) => {
    const list = document.createElement("ul")
    domainContainer.appendChild(list);
    const domains = await makeRequest("domain");
    domains
        .forEach(domain => list.appendChild(createCard(domain)));
};

const cardClick = async (domain_id) => {
    const mainContainer = document.getElementById("main-container")
    // console.log(`Clicked on ${object.domain_id}`)

    const existingPopup = document.querySelector(".popup")
    if (existingPopup) {
        existingPopup.remove()
    }

    let crawledData = await makeRequest("crawledData", {domain_id});

    const popup = document.createElement("div")
    popup.classList.add("popup")

    const closeButton = document.createElement("button")
    closeButton.classList.add("close-button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        popup.remove()
    });

    popup.appendChild(closeButton);


    crawledData.forEach(cdi => populateCrawlData(cdi, popup))
    document.body.appendChild(popup)

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
