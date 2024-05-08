const express = require('express');
const pool = require("../utils/db");
const router = express.Router();

/* GET the users domains. */
router.get('/', async (req, res, next) => {
    console.log(req.user_data);
    console.log(req.user_data)
    try {
        let userId = req.user_data.user_id;
        const result = await pool.query(`SELECT domain.*
FROM domain
         JOIN spider_user ON domain.user_id = spider_user.user_id
WHERE spider_user.user_id = $1;`, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to get users domains'});
    }
});

/* POST new domain for user. */
router.post('/add', async (req, res, next) => {
    try {
        const {domain_url: domainUrl} = req.body;

        if (!domainUrl) {
            return res.status(400).json({error: 'Domain name is required.'});
        }

        let userId = req.user_data.user_id;
        // Insert the new domain into the domains table
        const insertQuery = `
            INSERT INTO domain (user_id, url, timelastupdated)
            VALUES ($1, $2, now())
            RETURNING domain_id
        `;
        const values = [userId, domainUrl];
        const result = await pool.query(insertQuery, values);

        res.status(201).json(result.rows[0]); // Return the newly inserted domain
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to add domain'});
    }
});


module.exports = router;
