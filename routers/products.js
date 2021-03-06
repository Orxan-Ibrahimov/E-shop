const { Product } = require('../models/product')
const express = require('express')
const { Category } = require('../models/category')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const FileTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FileTypes[file.mimetype]
        let typeError = new Error('invalid image Type')
        if (isValid) typeError = null
        cb(typeError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.split(' ').join('-')
        const extension = FileTypes[file.mimetype]
        cb(null, `${filename}${Date.now()}.${extension}`)
        // cb(null, `${filename}${Date.now()}`)
    },
})

const uploadsOption = multer({ storage: storage })

router.post('/', uploadsOption.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category)

    if (!category) return res.status(400).send('Category is invalid')

    const file = req.file
    console.log(file);
    if (!file) return res.status(400).send('image is not in the request!')

    const filename = req.file.filename
    const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`

    let product = new Product({
        name: req.body.name,
        image: `${baseUrl}${filename}`,
        brand: req.body.brand,
        price: req.body.price,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        countInStock: req.body.countInStock,
        description: req.body.description,
        richDescription: req.body.richDescription,
        category: req.body.category,
    })

    product = await product.save()

    if (!product) {
        return res.status(400).send("Product can't be created!")
    }

    res.status(200).send(product)
})

router.get('/', async (req, res) => {
    // const products = await Product.find()
    let filter = {}
    // const products = await Product.find().populate('category')
    // const products = await Product.find().select("name -_id")
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }
    const products = await Product.find(filter).populate('category')

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.send(products)
})

// router.get('/', async (req, res) => {
//   // const products = await Product.find()
//   const products = await Product.find().populate('category')
//   // const products = await Product.find().select("name -_id")

//   if (!products) {
//       res.status(500).json({ success: false })
//   }
//   res.send(products)
// })

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments()

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.status(200).send({
        count: productCount,
    })
})

router.get('/get/featured', async (req, res) => {
    // const limit = +(req.params.count ? req.params.count : 0);
    // const products = await Product.find({isFeatured:true}).limit(limit);
    const products = await Product.find({ isFeatured: true })

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(products)
})

router.get('/:pid', async (req, res) => {
    const product = await Product.findById(req.params.pid)

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.put('/:pid',uploadsOption.single('image'), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.pid))
    return res.status(400).send('Product is Invalid')

    // const category = await Category.findById(req.body.category)
    // if (!category) return res.status(400).send('Category is invalid')

    const product = await Product.findById(req.params.pid)
    if (!product) return res.status(400).send('Product is invalid')
    const file = req.file
    let imagePath
    if (file) {
        const filename = req.file.filename
        const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`
        imagePath = `${baseUrl}${filename}`
    } else {
        imagePath = product.image
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.pid,
        {
            name: req.body.name,
            image: imagePath,
            brand: req.body.brand,
            price: req.body.price,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            countInStock: req.body.countInStock,
            description: req.body.description,
            richDescription: req.body.richDescription,
            category: req.body.category,
        },
        { new: true }
    )

    if (!updatedProduct)
        return res.status(404).send('Product can not be update')

    res.status(200).send(updatedProduct)
})

router.delete('/:pid', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.pid))
        return res.status(400).send('Product is Invalid')

    Product.findByIdAndRemove(req.params.pid)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product can not be deleted!',
                })
            }
            res.status(200).send(deletedProduct)
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                error: err,
            })
        })
})

router.put(
    '/image-gallery/:pid',
    uploadsOption.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.pid))
            return res.status(400).send('Product is Invalid')

        const files = req.files
        let imagePaths = []
        const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`
        if (files) {
            files.map((file) => {
                imagePaths.push(`${baseUrl}${file.filename}`)
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.pid,
            {
                images: imagePaths,
            },
            { new: true }
        )

        if (!product) return res.status(404).send('Product can not be update')

        res.status(200).send(product)
    }
)

module.exports = router
