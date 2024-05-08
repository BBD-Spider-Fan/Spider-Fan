const crawlPage = async (baseURL, currentURL, pages) => {
    const baseURLObject = new URL(baseURL)
    const currentURLObject = new URL(currentURL)

    if (baseURLObject.hostname !== currentURLObject.hostname) {
        return pages
    }

    console.log(`Starting crawl of ${currentURL}`)

    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`)
            return pages
        }

        let normalizedCurrentURL = normalizeURL(currentURL)
        normalizedCurrentURL = normalizedCurrentURL.replace(/\/\//g, "/")

        if (pages[normalizedCurrentURL] > 0) {
            pages[normalizedCurrentURL]++
            return pages
        }

        pages[normalizedCurrentURL] = 1

        const contentType = resp.headers.get("content-type")

        if (!contentType.includes("text/html")) {
            console.log(`error: non-html response, content-type: ${contentType}, on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }

    return pages

    // console.log(getURLsFromHTML(resp.text(), currentURL))
}

const normalizeURL = (urlString) => {
    const urlObject = new URL(urlString)
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    const linkRegex = /href="([^"]*)"/g;
    const urls = [];
    let match;

    while ((match = linkRegex.exec(htmlBody)) !== null) {
        if (match[1].startsWith("https://") || match[1].startsWith("http://")) {
            // Absolute URL
            try {
                const urlObject = new URL(match[1])
                urls.push(urlObject.href)
            } catch (err) {
                console.log(`Error with absolute url: ${err.message}`)
            }
        } else if (match[1].startsWith("/")) {
            // Relative URL
            try {
                const urlObject = new URL(`${baseURL}${match[1]}`)
                urls.push(urlObject.href)
            } catch (err) {
                console.log(`Error with relative url: ${err.message}`)
            }
        }
    }

    return urls
}

const sortPages = (pages) => {
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a, b) => {
        aHits = a[1]
        bHits = b[1]

        return b[1] - a[1]
    })

    return pagesArr
}

/*
const main = async () => {
    pages = await crawlPage("https://monkeytype.com/", "https://monkeytype.com/", {})

    for (const page of Object.entries(pages)) {
        console.log(page)
    }
}
*/

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
    sortPages
}