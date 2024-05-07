export const prioritize = pages => {
  const total = pages
    .map(p => p.count)
    .reduce((previous, current) => previous + current, 0);

  return pages.map(p => ({
    ...p,
    priority: p.count / total,
  }));
}

export const generate = pages => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';

  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  pages = prioritize(pages);

  pages.forEach(p => {
    sitemap += '<url>';
    sitemap += '<loc>' + p.href + '</loc>';
    sitemap += '<changefreq>' + 'never' + '</changefreq>';
    sitemap += '<priority>' + p.priority + '</priority>';
    sitemap += '</url>';
  });

  sitemap += '</urlset>';

  return sitemap;
}