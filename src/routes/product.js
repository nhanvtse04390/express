const express = require("express")
const router = express.Router()
const controller = require("../controllers/product")

router.post('/add-new', controller.addNew)
router.get('/list', controller.getList)
router.get('/:_id', controller.getProductById)
router.put('/:productId/remove-image', controller.deleteImage)

module.exports = router