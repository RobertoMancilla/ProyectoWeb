const jwt = require("jsonwebtoken");

function verifyAuthToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_HERE

    if (token) {
        console.log("Token encontrado, procesando...");
        try {
            const decoded = jwt.verify(token, "keySecret");
            console.log("Token válido, usuario autorizado:", decoded.email);
            req.email = decoded.email;
            req.id = decoded.id;
            next();
        } catch (error) {
            console.log("Token inválido:", error.message);
            res.status(401).send({
                error: "Invalid Authentication token"
            });
        }
    } else {
        res.status(400).send({
            error: "Authentication token is missing"
        });
    }
}


module.exports = {verifyAuthToken}