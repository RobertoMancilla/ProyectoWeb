const router = require("express").Router()
const Users = require("../data/schema_users")
const { verifyAuthToken } = require('../middleware/tokens');


router.get('/info', (req, res) => {
    
});
// Modify user data
// router.put('/', userController.updateUser);

module.exports = router;