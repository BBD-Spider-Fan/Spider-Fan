export const crawl = async (base, current, pages) => {
  if (base.hostname !== current.hostname) return pages;

  const normalizedCurrent = normalize(current);

  if (pages[normalizedCurrent.href]?.count > 0) {
    pages[normalizedCurrent.href].count += 1;
    return pages;
  }

  pages[normalizedCurrent.href] = { href: normalizedCurrent.href, count: 1 }

  console.log(`Crawling "${normalizedCurrent.href}"...`);

  try {
    const response = await fetch(current.href);

    if (response.status > 399) {
      console.log('Error fetching page... Staus code ', response.status);
      return;
    }

    const urls = extract(await response.text(), base.href);

    for (const url of urls) pages = await crawl(base, url, pages);

  } catch (error) {
    console.log('Error fetching page...', error.message);
  }

  return pages;
}

export const extract = (html, domain) => {
  let urls = [];

  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  if (domain.slice(-1) === '/') domain = domain.slice(0, -1);

  const anchors = document.querySelectorAll('a');

  for (const anchor of anchors) {
    if (anchor.getAttribute('href').slice(0, 1) === '/') {
      try {
        const url = new URL(`${domain}${anchor.getAttribute('href')}`);
        urls.push(url);
      } catch (error) {
        console.log('Error resolving URL...', error.message);
      }
    } else {
      try {
        const url = new URL(`${anchor.getAttribute('href')}`);
        urls.push(url);
      } catch (error) {
        console.log('Error resolving URL...', error.message);
      }
    }

  }

  return urls;
}

export const normalize = url => {

  let href = url.href;

  if (href.length > 0 && href.slice(-1) === '/') {
    href = href.slice(0, -1);
  }

  // HACK: Sometimes there are more than one '/'
  // if (hostAndPath.length > 0 && hostAndPath.slice(-1) === '/') {
  //   hostAndPath = hostAndPath.slice(0, -1);
  // }

  // hostAndPath = hostAndPath.replace('//', '/');

  return new URL(href);
}