const express = require ('express')
const router =  express.Router()
const imageController = require('../controllers/cafeController')
const upload = require('../multer')


router.post('/images', upload.single('images'), imageController.addImage)
router.get('/images',imageController.getAllImages )
router.post('/category', upload.single('icon') ,imageController.createCategory)
router.get('/category',imageController.getCategory)


module.exports = router;

