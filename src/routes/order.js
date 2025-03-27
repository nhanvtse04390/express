const express = require("express");
const router = express.Router();
const controller = require("../controllers/order");

router.post("/add-new", controller.addNew);

module.exports = router;
