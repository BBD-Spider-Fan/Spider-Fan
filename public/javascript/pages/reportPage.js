export const reportPage = async (contentElement, {urls, domain}) => {
    console.log('URLS', urls);

    contentElement.replaceChildren();

    const section = document.createElement('section');
    const searchForm = document.createElement('form');
    const searchInput = document.createElement('input');
    const links = document.createElement('ul');
    const dialog = document.createElement('dialog');
    const dialogTitle = document.createElement('h3');
    const dialogContent = document.createElement('form');
    const frequencyLabel = document.createElement('label');
    const countLabel = document.createElement('label');
    const priorityLabel = document.createElement('label');
    const frequencyInput = document.createElement('input');
    const countInput = document.createElement('input');
    const priorityInput = document.createElement('input');
    const dialogActionSection = document.createElement('section');
    const dialogCloseButton = document.createElement('button');
    const image = document.createElement('img');

    searchInput.setAttribute('id', 'search');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('name', 'search');
    searchInput.setAttribute('placeholder', 'Find URL');
    links.setAttribute('id', 'links');
    dialogTitle.innerText = domain;
    frequencyLabel.setAttribute('for', 'frequency');
    frequencyLabel.innerText = 'Frequency';
    countLabel.setAttribute('for', 'count');
    countLabel.innerText = 'Count';
    priorityLabel.setAttribute('for', 'priority');
    priorityLabel.innerText = 'Priority';
    frequencyInput.setAttribute('name', 'frequency');
    frequencyInput.setAttribute('type', 'text');
    // frequencyInput.setAttribute('value', 'never');
    frequencyInput.setAttribute('placeholder', 'Enter frequency');
    frequencyInput.setAttribute('disabled', "true");
    countInput.setAttribute('name', 'count');
    countInput.setAttribute('type', 'number');
    countInput.setAttribute('min', '0');
    countInput.setAttribute('step', '1');
    countInput.setAttribute('placeholder', '0');
    countInput.setAttribute('disabled', "true");
    priorityInput.setAttribute('name', 'priority');
    priorityInput.setAttribute('type', 'number');
    priorityInput.setAttribute('min', '0');
    priorityInput.setAttribute('max', '1');
    priorityInput.setAttribute('step', '0.1');
    priorityInput.setAttribute('placeholder', '0.00');
    priorityInput.setAttribute('disabled', true);
    dialogCloseButton.classList.add('secondary-button');
    dialogCloseButton.innerText = 'Close';
    image.setAttribute('id', 'web-i');
    image.setAttribute('src', '/assets/images/web-i.png');

    searchInput.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase();

        const items = links.getElementsByTagName('li');

        for (const item of items) {
            const text = item.textContent.toLowerCase();

            if (text.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });

    dialogCloseButton.addEventListener('click', () => {
        dialog.close();
    });

    section.appendChild(searchForm);
    section.appendChild(links);
    searchForm.appendChild(searchInput);
    dialog.appendChild(dialogTitle);
    dialog.appendChild(dialogContent);
    dialogContent.appendChild(frequencyLabel);
    dialogContent.appendChild(frequencyInput);
    dialogContent.appendChild(countLabel);
    dialogContent.appendChild(countInput);
    dialogContent.appendChild(priorityLabel);
    dialogContent.appendChild(priorityInput);
    dialog.appendChild(dialogActionSection);
    dialogActionSection.appendChild(dialogCloseButton);

    contentElement.appendChild(section);
    contentElement.appendChild(dialog);
    contentElement.appendChild(image);
    contentElement.className = '';
    contentElement.classList.add('report-page');

    for (const url of urls) {
        const item = document.createElement('li');
        const itemTitle = document.createElement('h3');

        item.addEventListener('click', () => {
            const dialogTitle = dialog.querySelector('h3');
            const frequencyInput = dialog.querySelector('input[name="frequency"]');
            const countInput = dialog.querySelector('input[name="count"]');

            dialogTitle.innerText = url.url;
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

        item.setAttribute('data-count', url.count);
        item.setAttribute('data-priority', url.priority);
        itemTitle.innerText = url.url;

        item.appendChild(itemTitle);
        links.appendChild(item);
    }
}