const express = require('express');
const pool = require("../db");
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET testing all tables. */
router.get('/test', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT count(*) FROM information_schema.tables;');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


module.exports = router;
