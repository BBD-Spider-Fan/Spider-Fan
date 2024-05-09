const express = require('express');
const {getOrCreateUser} = require("../utils/db");
const router = express.Router();

router.get('/', async (req, res) => {
    // Not setting status in the resp to avoid error on front end.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({error: 'Unauthorized: No ID Token found'});
    }
    const token = authHeader.split('Bearer ')[1];

    fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .then(response => response.json())
        .then(getOrCreateUser)
        .then(dataResponse => res.json(dataResponse))
        .catch(error => res.json({error: `Unauthorized: ${error}`}));
});

module.exports = router;
