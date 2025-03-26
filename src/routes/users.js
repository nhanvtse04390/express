const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/list", userController.getAllUsers);
router.get("/:_id", userController.getUserById);
router.put("/edit", userController.editUser);

module.exports = router;
