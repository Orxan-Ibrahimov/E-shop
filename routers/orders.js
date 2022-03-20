const express = require("express")
const { Order } = require("../models/order")
const { OrderItem } = require("../models/orderItem")
const router = express.Router();

router.get('/', async (req,res) => {
    const orderList = await Order.find();

    if(!orderList) return res.status(404).send("Orders weren't found");

    res.status(200).send(orderList);
});

router.post('/', async(req,res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            product: orderItem.product,
            quantity: orderItem.quantity
        });

        newOrderItem = await newOrderItem.save();

       
        return newOrderItem._id;
    }));     

    const orderItemsIdsResolved = await orderItemsIds;
    
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        totalPrice: req.body.totalPrice,
        status: req.body.status,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered          
    });

    order = await order.save();

    if(!order) return res.status(400).send("Order can not be Added");

    res.status(200).send(order);
})

module.exports = router;