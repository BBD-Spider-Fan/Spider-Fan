import {makeRequest} from "../utils.js";

export async function historyPage(contentElement) {
    contentElement.replaceChildren();

    const spinner = document.createElement('spider-spinner');

    contentElement.appendChild(spinner);

    const domains = await makeRequest("domain")
        .finally(() => spinner.remove());

    // contentElement.children.clear();
    let domainContainer = document.createElement("section");
    domainContainer.classList.add("domain-container");
    // Populate list
    await populateData(domains, domainContainer);

    contentElement.appendChild(domainContainer);
    contentElement.className = '';
    contentElement.classList.add('history-page');
}


const createCard = domain => {
    const card = document.createElement("div");
    card.classList.add("card");

    const url = document.createElement("p");
    url.textContent = `URL: ${domain.url}`;

    const timeUpdated = document.createElement("p");
    console.log(domain)
    const date = new Date(domain.timelastupdated);
    // const fixedDate = date.
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    console.log(date);

    const saDateTime = date.toLocaleString('en-ZA', options);
    // Who should I be thanking for this, AWS for storing now() as UTC in pg, node pg for returning it as if it was ZA time so -2 or js for not making this distinction.
    // Yeah, node pg https://stackoverflow.com/questions/31608368/nodes-postgres-module-pg-returns-wrong-date
    // Somehow our date is seen as ZA even though it should not really be thus node pg stuffs it up on retrieval.
    // If there was more time would look at what happens if db was created in different areas how this would affect Node PG.
    // Cool that this was not documented anywhere lesson in all this is that dates are HARD....
    // Seems like this is only on local. So basically it is good would hate to manage this in real production.
    // Dev spend all their time fixing this locally only for it to break online and don't get me started on deploying this in multiple locations ;)
    timeUpdated.textContent = `Last Updated UCT: ${saDateTime}`;
    card.appendChild(url);
    card.appendChild(timeUpdated);

    // Cool hack to get remove click handler later.
    let click = () => {
        cardClick(click, card, domain.domain_id);
    };
    card.addEventListener("click", click);

    return card;
};


const populateData = async (domains, domainContainer) => {
    const list = document.createElement("ul");
    domainContainer.appendChild(list);

    if (domains.length === 0) {
        const userMessage = document.createElement("p");
        userMessage.classList.add("user-message");
        userMessage.textContent = "You have no history 	¯\\(o_o)/¯";
        domainContainer.appendChild(userMessage);
        return
    }
    domains
        .forEach(domain => list.appendChild(createCard(domain)));
};

const cardClick = async (click, card, domain_id) => {
    const initialDisplayValues = [];
    const spinner = document.createElement('spider-spinner');
    const contentElement = document.querySelector('#content');

    card.removeEventListener("click", click);


    const existingPopup = document.querySelector("dialog")
    if (existingPopup) {
        existingPopup.close();
        existingPopup.remove();
    }

    for (let i = 0; i < contentElement.children.length; i += 1) {
        initialDisplayValues.push(contentElement.children.item(i).style.display);
        contentElement.children.item(i).style.display = 'none';
    }

    contentElement.appendChild(spinner);

    let crawledData = await makeRequest("crawledData", {domain_id})
        .finally(() => {
            spinner.remove();
            for (const [index, displayValue] of initialDisplayValues.entries()) {
                contentElement.children.item(index).style.display = initialDisplayValues[index];
            }
        });

    const popup = document.createElement("dialog")

    const closeButton = document.createElement("button")
    closeButton.classList.add("close-button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        popup.close();
        popup.remove();
        card.addEventListener("click", click);
    });

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.close();
            popup.remove();
            card.addEventListener("click", click);
        }
    })

    popup.appendChild(closeButton);

    if (crawledData.length === 0) {
        const historyMessage = document.createElement("p");
        historyMessage.classList.add("history-message");
        historyMessage.textContent = "You have no crawled urls 	¯\\(o_o)/¯";
        popup.appendChild(historyMessage);
    } else {
        crawledData.forEach(cdi => populateCrawlData(cdi, popup));
    }

    document.body.appendChild(popup);

    popup.showModal();

};

let populateCrawlData = (scrapedURL, popup) => {
    const scrapedURLText = document.createElement("p");
    scrapedURLText.textContent = `URL: ${scrapedURL.url}`;

    const scrapedURLCount = document.createElement("p");
    scrapedURLCount.textContent = `count: ${scrapedURL.count}`;
    scrapedURLCount.style.marginBottom = "0.5em";

    popup.appendChild(scrapedURLText);
    popup.appendChild(scrapedURLCount);
};

