const {Product} = require('../models/product');
const express = require("express");
const router = express.Router();
  
  router.post("/", (req, res) => {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStack: req.body.countInStack
    });
  
    product.save()
    .then((createdProduct) => {
   res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success:false
      })
    });
  });
  
  router.get('/', async (req, res) => {
  const products = await Product.find();

  if(!products){
      res.status(500).json({success:false});
  }
  res.send(products); 
  });

  module.exports = router;