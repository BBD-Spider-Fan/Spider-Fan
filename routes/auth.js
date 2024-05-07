const express = require('express');
const pool = require("../db");
const router = express.Router();

router.get('/', async function (req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized: No ID Token found'});
    }
    const token = authHeader.split('Bearer ')[1];

    let dataResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .then(token => token.json())
        .then(getOrCreateUser)
        .catch(err => res.status(401).json({message: `Unauthorized: ${err}`}));
    console.log(dataResponse);

    res.json(dataResponse);
});


async function getOrCreateUser(tokenInfo) {
    console.log(tokenInfo)
    const values = [tokenInfo.sub, tokenInfo.email];
    try {
        let data = await pool.query(`SELECT * FROM upsert_spider_user($1, $2)`, values)
        return data.rows[0];
    } catch (err) {
        return {message: 'Internal Server Error unable to get user from db'};
    }
}

module.exports = router;
