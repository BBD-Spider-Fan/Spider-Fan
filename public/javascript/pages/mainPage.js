import { makeRequest, prioritize } from "../utils.js";
import {reportPage} from "./reportPage.js";

export const mainPage = contentElement => {
    contentElement.replaceChildren();

    const section = document.createElement('section');
    const greeter = document.createElement('h2');
    const searchForm = document.createElement('form');
    const searchLabel = document.createElement('label');
    const searchInput = document.createElement('input');
    const searchButton = document.createElement('button');
    const image = document.createElement('img');

    greeter.innerText = 'Your SEO companion!';
    searchLabel.setAttribute('for', 'search');
    searchInput.setAttribute('id', 'search');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('name', 'search');
    searchInput.setAttribute('placeholder', 'Paste URL here');
    searchButton.setAttribute('type', 'submit');
    searchButton.innerText = 'Generate';
    image.setAttribute('id', 'web-i');
    image.setAttribute('src', '/assets/images/web-i.png');

    searchButton.addEventListener('click', async e => {
        e.preventDefault();
        const searchTerm = searchInput.value;

        const urls = prioritize(await makeRequest('/domain/add', { domain_url: searchTerm }, 'POST')
            .then(({ domain_id: id }) => {
                console.log('ID', id);
                return makeRequest('/crawledData/crawl', { domain_id: id }, 'POST')
                    .then(
                        () => makeRequest('/crawledData', { domain_id: id }, 'GET')
                    );
            }));

        reportPage(contentElement, { urls, domain: searchTerm });
    });

    section.appendChild(greeter);
    section.appendChild(searchForm);
    searchForm.appendChild(searchLabel);
    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);

    contentElement.appendChild(section);
    contentElement.appendChild(image);
    contentElement.className = '';
    contentElement.classList.add('main-page');
};