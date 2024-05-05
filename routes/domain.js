const express = require('express');
const pool = require("../db");
const router = express.Router();

/* GET the users projects. */
router.get('/', async (req, res, next) => {
    console.log(req.user_data);
    console.log(req.user_data)
    try {
        let userId = req.user_data.user_id;
        const result = await pool.query(`SELECT domain.*
FROM domain
         JOIN spider_user ON domain.user_id = spider_user.user_id
WHERE spider_user.user_id = $1;`,
            [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to get users projects'});
    }
});

/* POST new project for user. */
router.post('/add', async (req, res, next) => {
    try {
        const {domain_url} = req.body;

        if (!project_name || !description) {
            return res.status(400).json({error: 'Project name and description are required.'});
        }

        const user_id = req.user.id;

        // Insert the new project into the projects table
        const insertQuery = `
            INSERT INTO projects (user_id, project_name, description)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [user_id, project_name, description];
        const result = await pool.query(insertQuery, values);

        res.status(201).json(result.rows[0]); // Return the newly inserted project
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to add project'});
    }
});


module.exports = router;
