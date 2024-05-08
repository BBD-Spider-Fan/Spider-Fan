const {fetchData} = require("../utils/utils");
const {getOrCreateUser} = require("../utils/db");
const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unauthorized: No ID Token found'});
    }
    const token = authHeader.split('Bearer ')[1];
    fetchData(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .then(getOrCreateUser)
        .then(dataResponse => {
            req.user_data = dataResponse;
            next();
        })
        .catch(error => res.status(401).json({error: `Unauthorized: ${error}`}));
}

module.exports = verifyToken;