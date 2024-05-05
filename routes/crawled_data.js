const express = require('express');
const pool = require("../db");
const crawl = require("../crawl");
const router = express.Router();

/* GET the domain crawled data. */
router.get('/', async (req, res) => {
    let domainId = req.query.domain_id;
    if (!domainId) {
        return res.status(400).json({error: 'Domain id is required.'});
    }

    try {
        const result = await pool.query(`
                    SELECT crawled_data.url, crawled_data.count
                    FROM crawled_data
                             JOIN domain ON domain.domain_id = crawled_data.domain_id
                    WHERE crawled_data.domain_id = $1;
            `, [domainId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to get domain crawl data'});
    }
});

router.post('/crawl', async (req, res) => {
    let domainId = req.body.domain_id;
    if (!domainId) {
        return res.status(400).json({error: 'Domain id and url are required.'});
    }

    try {
        const result = await pool.query(`
                      SELECT url
                      FROM domain
                      WHERE domain_id = $1;
              `,
            [domainId]);


        let baseURL = result.rows[0].url;
        let pages = await crawl.crawlPage(baseURL, baseURL, {});


        // Extract keys (urls) and values (counts) from inputData
        const urls = Object.keys(pages);
        const counts = Object.values(pages);

        // Construct placeholders for the URLs and counts
        const placeholders = urls.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(',');
        const values = urls.flatMap((url, index) => [domainId, url, counts[index]]);
        let insertQuery = `
        INSERT INTO crawled_data (domain_id, url, count) VALUES
        ${placeholders}
    `;

        try {
            pool.query(insertQuery, values)
            res.json({"ok": true})

        } catch (e) {
            console.error('Error executing query', e);
            res.status(500).json({error: 'Internal Server Error Inserting failed'});
        }

    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to get domain crawl data'});
    }
});


router.post('/xml', async (req, res) => {
    let domainId = req.body.domain_id;
    try {
        const result = await pool.query(`
                    SELECT crawled_data.url, crawled_data.count
                    FROM crawled_data
                             JOIN domain ON domain.domain_id = crawled_data.domain_id
                    WHERE crawled_data.domain_id = $1;
            `, [domainId]);

        let rows = result.rows;
        let xmlString = '<urlset>';

        rows.forEach(item => {
            const url = item.url;

            xmlString += `
                    <url>
                        <loc>${url}</loc>
                    </url>`;
        });
        xmlString += '\n</urlset>';
        res.send(xmlString)
    } catch (e) {
        console.error('Error executing query', e);
        res.status(500).json({error: 'Internal Server Error Inserting failed'});
    }


});

module.exports = router;
