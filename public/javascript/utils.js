export const makeRequest = async (endpoint, data = null, method = "GET") => {
    let url = `/api/${endpoint}`;
    let token = localStorage.getItem("token");

    const fetchOptions = {
        method, headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
        }, body: method !== "GET" ? JSON.stringify(data) : null
    };
    if (method === "GET" && data) {
        const queryParams = new URLSearchParams(data).toString();
        url += '?' + queryParams;
    }
    try {
        const response = fetch(url, fetchOptions).then(d => d.json());
        return await response;
    } catch (err) {
        // TODO: nice error display to user
        console.log(err);
    }

};
