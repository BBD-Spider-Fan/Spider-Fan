const express = require('express');
const pool = require("../db");
const crawl = require("../crawl");
const router = express.Router();

/* GET the domain crawled data. */
router.get('/', async (req, res) => {
    let domainId = req.body.domain_id;
    if (!domainId) {
        return res.status(400).json({error: 'Domain id is required.'});
    }

    try {
        const result = await pool.query(`
                    SELECT crawled_data.url, crawled_data.count
                    FROM crawled_data
                             JOIN domain ON domain.domain_id = crawled_data.domain_id
                    WHERE crawled_data.domain_id = $1;
            `,
            [domainId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Internal Server Error unable to get domain crawl data'});
    }
});

router.post('/crawl', async (req, res) => {
    let domainId = req.body.domain_id;
    let domainUrl = req.body.domain_url;
    if (!domainId || !domainUrl) {
        return res.status(400).json({error: 'Domain id and url are required.'});
    }
    let pages = await crawl.crawlPage(domainUrl, domainUrl, {});
    res.json(pages);

    /*  try {
          const result = await pool.query(`
                      SELECT crawled_data.url, crawled_data.count
                      FROM crawled_data
                               JOIN domain ON domain.domain_id = crawled_data.domain_id
                      WHERE crawled_data.domain_id = $1;
              `,
              [domainId]);
          res.json(result.rows);
      } catch (err) {
          console.error('Error executing query', err);
          res.status(500).json({error: 'Internal Server Error unable to get domain crawl data'});
      }*/
});


module.exports = router;
