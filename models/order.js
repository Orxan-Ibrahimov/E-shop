const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true
    }],
    shippingAddress1: {
        type:String,
    },
    shippingAddress2: {
        type:String,
    },
    city: {
        type:String,
        required: true
    },
    zip: {
        type:String,
        required: true
    },
    country: {
        type:String,
        required: true
    },
    phone: {
        type:String,
        required: true
    },
    totalPrice: {
        type:Number,
    },
    status: {
        type:String,
        required: true,
        default:'Pending'
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {
        type:Date,
        default:Date.now
    }
})

OrderSchema.virtual("id").get(function(params) {
    return this._id.toHexString();
});

OrderSchema.set('toJSON', {
    virtuals: true,
})
const Order = mongoose.model('Order', OrderSchema);

exports.Order = Order;