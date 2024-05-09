export const makeRequestRaw = async (endpoint, data = null, method = "GET") => {
    let url = `/api/${endpoint}`;
    let token = localStorage.getItem("idToken");

    const fetchOptions = {
        method, headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
        }, body: method !== "GET" ? JSON.stringify(data) : null
    };
    if (method === "GET" && data) {
        const queryParams = new URLSearchParams(data).toString();
        url += '?' + queryParams;
    }
    return await fetch(url, fetchOptions);
};

export const makeRequest = async (endpoint, data = null, method = "GET") => {
    return makeRequestRaw(endpoint, data, method).then(d => d.json())
}

export const prioritize = anchors => {
    const total = anchors
        .map(a => a.count)
        .reduce((previous, current) => previous + current, 0);

    return anchors.map(a => ({
        ...a,
        priority: a.count / total,
    }));
}