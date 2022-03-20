const express = require("express")
const { Order } = require("../models/order")
const { OrderItem } = require("../models/orderItem")
const router = express.Router();

router.get('/', async (req,res) => {
    const orderList = await Order.find();

    if(!orderList) return res.status(404).send("Orders weren't found");

    res.status(200).send(orderList);
});

router.get('/:orderId', async (req,res) => {
    let order = await Order.findById(req.params.orderId)
    .populate('user', 'name email')
    .populate({path:'orderItems', populate: {path: 'product', populate: 'category'}});

    
    if(!order) return res.status(404).send("Order wasn't found");

    res.status(200).send(order);
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
    
    const totalPrices = await Promise.all((await orderItemsIds).map(async(orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product'); 
        const totalPrice = orderItem.quantity * orderItem.product.price;

        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b,0);   

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        totalPrice: totalPrice,
        status: req.body.status,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered          
    });

    order = await order.save();

    if(!order) return res.status(400).send("Order can not be Added");

    res.status(200).send(order);
})

router.put('/:orderId', async(req,res) => {
    const order = await Order.findByIdAndUpdate(req.params.orderId,
        {
            status : req.body.status
        },
        {new : true})

        if(!order) return res.status(404).send("Order can not be updated")


        res.status(200).send(order)
})

router.delete('/:orderId', async(req,res) => {  

    const order = await Order.findByIdAndRemove(req.params.orderId);

    if(!order) return res.status(400).send("Order can not be deleted")

    order.orderItems.map(async (deletedOrderItem) => {
        await OrderItem.findByIdAndRemove(deletedOrderItem);
    })

    res.status(200).send(order)
})

router.get('/get/count', async (req,res) => {
    let orderCount = await Order.countDocuments();  
    
    if(!orderCount) return res.status(404).send("Order wasn't found");    

    res.status(200).json({
        orders : orderCount
    });
});

router.get('/get/totalPrice', async (req,res) => {
    let orderList = await Order.find();  
    
    if(!orderList) return res.status(404).send("Order wasn't found");   
    
    const totalPrices = await Promise.all(orderList.map(async (order) => {
        return order.totalPrice;
    }))
    const totalPrice = totalPrices.reduce((a,b) => a + b, 0)

    res.status(200).json({
        totalPrice : totalPrice
    });
});

router.get('/get/totalSales', async (req,res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalPrice: {$sum: '$totalPrice'}}}
    ]);  
    
    if(!totalSales) return res.status(404).send("Sales weren't found");     

    res.status(200).send({totalSales: totalSales.pop().totalPrice})
});

router.get('/get/userOrders/:userId', async (req,res) => {
    const orderList = await Order.find({user: req.params.userId})
    .populate('user')
    .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
    .sort({dateOrdered: -1});
    
    if(!orderList) return res.status(404).send("User Orders weren't found");    

    res.status(200).send(orderList)
});

module.exports = router;