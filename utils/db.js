const {Pool} = require('pg');

// Database connection configuration
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: {rejectUnauthorized: false,},
});


const getOrCreateUser = async (tokenInfo) => {
    const values = [tokenInfo.sub, tokenInfo.email];
    return (makeDbCall('SELECT * FROM upsert_spider_user($1, $2)', values)).then(row => row[0])
}
const getDomainById = async (userId, domainId) => {
    const values = [userId, domainId];
    const sql = `
                    SELECT crawled_data.url, crawled_data.count
                    FROM crawled_data
                             JOIN domain ON domain.domain_id = crawled_data.domain_id
                    WHERE crawled_data.domain_id = $1;
                    `

    return (makeDbCall(sql, values)).then(row => row[0])
}

const makeDbCall = async (sql, data) => {
    try {
        let result = await pool.query(sql, data);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err);
        throw new Error(`Internal Server Error: Sql error`);
    }
}

// export = pool;
module.exports = {
    pool, getOrCreateUser, getDomainById
};
