const User = require('../data/schema_model_users');
const bcrypt = require('bcrypt');

async function getUserInfo(req, res) {
    const id = req.id;
    
    try {
        const user = await User.findById(id);
        console.log(req.query);

        if (user) {
            console.log("user info:", user);

            res.send({
                name : user.name,
                surname : user.surname,
                email : user.email 
            });
            return;
        } else {
            res.status(404).send({
                error : "user not found"
            });
            return;
        }
    } catch (error) {
        console.error("Failed to retrieve user:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
    
}

async function updateUser(req, res) {
    const data = req.body;
    const id = req.id;
    const query = {};

    console.log("data:", data);

    if ("name" in data) {
        query.name = data["name"];
    }

    if ("email" in data) {
        try {
            query.email = data["email"];
        } catch (error) {
            res.status(400).send({
                error: "Could not update email "+error
            });
        }
    }

    if ("password" in data) {
        
    }
}

module.exports = {getUserInfo, updateUser}