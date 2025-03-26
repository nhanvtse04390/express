const express = require("express");
const router = express.Router();
const login = require("../controllers/login");

router.post("/", login.userLogin);

module.exports = router;
