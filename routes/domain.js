const express = require('express');
const {insertIntoDomain, getAllDomainsForUser} = require("../utils/db");
const router = express.Router();

/* GET the users domains. */
router.get('/', async (req, res, next) => {
    try {
        res.json(await getAllDomainsForUser(req.user_data.user_id));
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

        let result = await insertIntoDomain(userId, domainUrl);
        res.status(201).json(result); // Return the newly inserted domain
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to add domain'});
    }
});


module.exports = router;
