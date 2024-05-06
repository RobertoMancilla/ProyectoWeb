const jwt = require("jsonwebtoken");

function verifyAuthToken(req, res, next) {
    const sToken = req.get("x-auth");

    if(sToken && sToken!=''){
        var decoded;
        try {
            decoded=jwt.verify(sToken, process.env.JWT_SECRET);
            req.email = decoded.email;
            req.id = decoded.id;
            next();
            return;
        } catch (error) {
            res.status(401).send({
                error: "Invalid x-auth token"
            });
            return;
        }
    }else{
        res.status(400).send({
            error: "Missing or bad x-auth token"
        });
        return;
    }
}

module.exports = {verifyAuthToken}