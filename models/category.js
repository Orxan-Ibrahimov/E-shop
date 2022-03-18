const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    }
});

const Category = mongoose.model('Category',CategorySchema);

CategorySchema.virtual('id').get(function () {
    return this._id.toHexString()
})

CategorySchema.set('toJSON', {
    virtuals: true,
})


exports.Category = Category;
