const router = require("express").Router()
const userController = require("../controllers/user-controller")

// Get info of the users
router.get('/', userController.getUserInfo);

// Modify user data
router.put('/', userController.updateUser);

module.exports = router;