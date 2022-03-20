const mongoose = require('mongoose')

const OrderItemSchema = mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type:Number,
        required:true,
    }
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

OrderItemSchema.virtual("id").get(function(params) {
    return this._id.toHexString();
});

OrderItemSchema.set('toJSON', {
    virtuals: true,
})


exports.OrderItem = OrderItem