const express = require("express");
const router = express.Router();
const controller = require("../controllers/order");

router.post("/add-new", controller.addNew);
router.get("/list", controller.getListOrder);
router.get("/:_id", controller.getOrderById);

module.exports = router;
