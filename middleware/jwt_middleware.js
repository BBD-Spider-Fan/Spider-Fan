const parseJwt = token => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

// Function to decode JWT token
const decodeToken = (token) => {
    // Split token into header, payload, and signature
    const headerEncoded = token.split('.')[0];
    const payloadEncoded = token.split('.')[1];

    // Base64 decode header and payload
    const header = Buffer.from(headerEncoded, 'base64').toString();
    const payload = Buffer.from(payloadEncoded, 'base64').toString();

    // Parse JSON payload
    const decoded = JSON.parse(payload);

    // TODO: make the call out to provider to get the data back

    return decoded;
};


const verifyToken = (req, res, next) => {
    // Get token from header
    const token = req.headers.authorization;
    console.log(token)
    // Check if token is present
    if (!token) {
        return res.status(401).json({message: 'Access denied. No token provided.'});
    }

    try {
        // Decode token
        // Attach user information to the request object
        req.user = decodeToken(token);
        console.log(req.user)
        next();
    } catch (error) {
        // Token verification failed
        res.status(401).json({message: 'Invalid token.'});
    }
};


module.exports = verifyToken;