const {Pool} = require('pg');
const {rows} = require("pg/lib/defaults");

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
    let sql = `
            SELECT * 
            FROM upsert_spider_user($1, $2)
    `;
    return makeDbCallOne(sql, values);
}

const getAllDomainsForUser = async (userId) => {
    const values = [userId];
    let sql = `
            SELECT domain.*
            FROM domain
                JOIN spider_user ON domain.user_id = spider_user.user_id
            WHERE spider_user.user_id = $1;
    `;
    return makeDbCall(sql, values);
}


const getAllCrawledDataForDomain = async (userId, domainId) => {
    const values = [userId, domainId];
    const selectQuery = `
                    SELECT crawled_data.url, crawled_data.count
                    FROM crawled_data
                             JOIN domain ON domain.domain_id = crawled_data.domain_id
                    WHERE crawled_data.domain_id = $1;
    `;
    return makeDbCall(selectQuery, values);
}

const insertIntoDomain = async (userId, domainId) => {
    const values = [userId, domainId];
    const insertQuery = `
                    INSERT INTO domain (user_id, url, timelastupdated)
                    VALUES ($1, $2, now())
                    RETURNING domain_id;
    `;
    return makeDbCallOne(insertQuery, values);
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

const makeDbCallOne = async (sql, data) => {
    return makeDbCall(sql, data).then(rows => rows[0]);
}


// export = pool;
module.exports = {
    getOrCreateUser,
    getAllCrawledDataForDomain,
    getAllDomainsForUser,
    insertIntoDomain
};
