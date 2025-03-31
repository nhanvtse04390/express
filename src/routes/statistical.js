const express = require("express");
const router = express.Router();
const statistical = require("../controllers/statistical");

router.get("/", statistical.getUsersWithReferralOrders );

module.exports = router;
