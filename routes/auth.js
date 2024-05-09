const express = require('express');
const pool = require("../utils/db");
// const fetchData = require("../utils/utils");
const {getOrCreateUser} = require("../utils/db");
const router = express.Router();

router.get('/', async function (req, res) {
    // Not setting status in the resp to avoid error on front end.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({error: 'Unauthorized: No ID Token found'});
    }
    const token = authHeader.split('Bearer ')[1];

    fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .then(response => {
            if (!response.ok) res.json({error: `Unauthorized:`});
            return response.json();
        })
        .then(getOrCreateUser)
        .then(dataResponse => res.json(dataResponse))
        .catch(error => res.json({error: `Unauthorized: ${error}`}));

/*    fetchData(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .then(getOrCreateUser)
        .then(dataResponse => res.json(dataResponse))
        .catch(error => res.json({error: `Unauthorized: ${error}`}));*/
});

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

module.exports = router;
