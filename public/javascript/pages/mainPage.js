import {makeRequest, prioritize} from "../utils.js";
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
    const spinner = document.createElement('spider-spinner');

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

        try {
            new URL(searchInput.value);
        } catch (error) {
            alert('Invalid URL');
            return;
        }

        const searchTerm = searchInput.value;
        const initialDisplayValues = [];
        let urls = [];

        for (let i = 0; i < contentElement.children.length; i += 1) {
            const child = contentElement.children.item(i);
            initialDisplayValues.push(child.style.display);
            child.style.display = 'none';
        }

        contentElement.appendChild(spinner);

        try {
            urls = prioritize(await makeRequest('domain/add', {domain_url: searchTerm}, 'POST')
                .then(({domain_id: id}) => makeRequest('crawledData/crawl', {domain_id: id}, 'POST')
                    .then(() => makeRequest('crawledData', {domain_id: id}, 'GET'))));
        } catch (error) {
            for (const [index, displayValue] of initialDisplayValues.entries()) {
                contentElement.children.item(index).style.display = displayValue;
            }
        } finally {
            spinner.remove();
        }

        reportPage(contentElement, {urls, domain: searchTerm});
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