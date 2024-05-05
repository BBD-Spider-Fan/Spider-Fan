const https = require('https');
const pool = require('../db');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized: No ID Token found'});
    }

    const token = authHeader.split('Bearer ')[1];

    const options = {
        hostname: 'oauth2.googleapis.com', port: 443, path: `/tokeninfo?id_token=${token}`, method: 'GET',
    };

    const tokenReq = https.request(options, (tokenRes) => {
        let data = '';

        tokenRes.on('data', (chunk) => {
            data += chunk;
        });

        tokenRes.on('end', () => {
            const tokenInfo = JSON.parse(data);
            if (tokenInfo.error) {
                return res.status(401).json({message: `Unauthorized: ${tokenInfo.error}`});
            }
            console.log(tokenInfo)

            // Make call to db to get user
            const values = [tokenInfo.sub, tokenInfo.email];

            try {
                pool.query(`SELECT * FROM upsert_spider_user($1, $2)`, values).then((data) => {
                    req.user_data = data.rows[0];
                    console.log("Successful Verification");
                    next();
                });
            } catch (err) {
                console.error('Error executing query', err);
                res.status(500).json({error: 'Internal Server Error unable to get user from db'});
            }


        });
    });

    tokenReq.on('error', (e) => {
        console.error(e);
        return res.status(500).json({message: 'Internal Server Error'});
    });

    tokenReq.end();

}

module.exports = verifyToken;