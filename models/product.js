const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    image: {
        type: String,
        default: '',
    },
    images: [
        {
            type: String,
            default: '',
        },
    ],
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
})

const Product = mongoose.model('Product', ProductSchema)

ProductSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

ProductSchema.set('toJSON', {
    virtuals: true,
})

exports.Product = Product
