const router = require("express").Router()
const userController = require("../controllers/user-controller")
const { verifyAuthToken } = require('../middleware/tokens');

// Get info of the users
router.get('/:userId', verifyAuthToken, userController.getUserInfo);

// Modify user data
router.put('/', userController.updateUser);

module.exports = router;