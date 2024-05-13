const router = require("express").Router();
const Users = require("../data/schema_users");
const { verifyAuthToken } = require('../middleware/tokens');

// Get info of the user
router.get('/info', verifyAuthToken, async (req, res) => {
    try {
        const user = await Users.findById(req.id); // asumiendo que req.id se establece en verifyAuthToken
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({
            email: user.email,
            name: user.name,
            surname: user.surname
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Modify user data
// router.put('/', userController.updateUser);

module.exports = router;
