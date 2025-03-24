const express = require("express")
const router = express.Router()
const controller = require("../controllers/product")

router.post('/add-new', controller.addNew)
router.get('/list', controller.getList)
router.get('/:_id', controller.getProductById)
router.put('/:productId/remove-image', controller.deleteImage)
router.put('/:productId/edit', controller.updateProduct)
router.put('/delete-product/:_id', controller.deleteProduct)

module.exports = router