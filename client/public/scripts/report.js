import { crawl, prioritize } from './crawler.js';

const domain = new URL('https://localhost:3001');

const urls = prioritize(Object.values(await crawl(domain, domain, {})));

let filteredUrls = urls;

const linkList = document.querySelector('#links');
const search = document.querySelector('#search');
const dialog = document.querySelector('dialog');
const primaryButton = document.querySelector('.primary-button');
const secondaryButton = document.querySelector('.secondary-button');

search.addEventListener('input', e => {
  const searchTerm = e.target.value.toLowerCase();

  console.log('EVENT', e.target.value);

  filteredUrls = filteredUrls
    .filter(u => u.href.includes(searchTerm))
    .sort((a, b) => a.count - b.count);

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

secondaryButton.addEventListener('click', () => {
  dialog.close();
});

for (const url of urls) {
  const item = document.createElement('li');
  const itemTitle = document.createElement('h3');

  item.addEventListener('click', () => {
    const dialogTitle = dialog.querySelector('h3');
    const frequencyInput = dialog.querySelector('input[name="frequency"]');
    const countInput = dialog.querySelector('input[name="count"]');
    const priorityInput = dialog.querySelector('input[name="priority"]');

    dialogTitle.innerHTML = url.href;
    frequencyInput.value = 'never';
    countInput.value = url.count;
    priorityInput.value = url.priority;

    countInput.addEventListener('input', () => {
      const minimum = priorityInput.getAttribute('min');

      if (countInput.value < minimum) countInput.value = countInput.minimum;
    });

    priorityInput.addEventListener('input', () => {
      const maximum = priorityInput.getAttribute('max');
      const minimum = priorityInput.getAttribute('min');

      if (priorityInput.value > maximum) {
        priorityInput.value = priorityInput.maximum;
      }

      if (priorityInput.value < minimum) {
        priorityInput.value = priorityInput.minimum;
      }
    });

    dialog.showModal();
  });

  console.log(url);

  item.setAttribute('data-count', url.count);
  item.setAttribute('data-priority', url.priority);
  itemTitle.innerText = url.href;

  item.appendChild(itemTitle);
  linkList.appendChild(item);
}