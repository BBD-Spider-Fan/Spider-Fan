const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`${response.status}`);
                return response.json();
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
};

module.exports = fetchData;