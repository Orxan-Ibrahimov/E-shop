const mongoose = require("mongoose");


const ProductSchema = mongoose.Schema({
    name:String,
    image:String,
    countInStack:Number
  });

  const Product = mongoose.model('Product', ProductSchema);
 
  exports.Product = Product;