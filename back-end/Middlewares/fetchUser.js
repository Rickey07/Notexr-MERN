const jwt = require('jsonwebtoken');
const JWT_SECRET = "orandlohhjadhf45"


const fetchUser = (req,res,next) => {
    // Get the user from the JWT Token and add req object to that
    const token = req.header('auth-token');
    if (!token) {
        res.sendStatus(401).send({error:"Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
        res.sendStatus(401).send({error:"Please authenticate using a valid token"})
    }
    
}

module.exports = fetchUser;