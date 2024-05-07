import { crawl } from './crawler.js';

const domain = new URL('https://obsidian.md');

const urls = Object.values(await crawl(domain, domain, {}));

let filteredUrls = urls;

const linkList = document.getElementById('links');

const search = document.getElementById('search');

search.addEventListener('input', e => {
  const searchTerm = e.target.value.toLowerCase();

  console.log('EVENT', e.target.value);

  filteredUrls = filteredUrls.filter(u => u.href.includes(searchTerm));

  const items = linkList.getElementsByTagName('li');

  for (const item of items) {
    const text = item.textContent.toLowerCase();

    if (text.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  }
});

for (const url of urls) {
  const item = document.createElement('li');
  const itemTitle = document.createElement('h3');
  itemTitle.innerText = url.href;
  item.appendChild(itemTitle);
  linkList.appendChild(item);
}