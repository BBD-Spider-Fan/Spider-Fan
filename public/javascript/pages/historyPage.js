import {makeRequest} from "../utils.js";

export async function historyPage(contentElement) {
    // Remove other content
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
        .map(domain => createCard(domain))
        .forEach(list.appendChild);
};

const cardClick = async (domain) => {
    await makeRequest("crawledData")
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

    card.addEventListener("click", () => cardClick(domain));

    return card;
}
