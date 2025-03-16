const express = require("express")
const router = express.Router()
const controller = require("../controllers/product")

router.post('/add-new', controller.addNew)

module.exports = router