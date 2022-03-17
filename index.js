const express = require("express");
const app = express();
require("dotenv/config");
const api = process.env.API_URL;
const morgan = require("morgan");
const mongoose = require("mongoose");


app.use(express.json());
app.use(morgan('tiny'));

app.post(api + "/products", (req, res) => {
  const product = new Product({
    id: req.body.id,
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

app.get(api + "/products", async (req, res) => {
const products = await Product.find();
res.send(products); 
});

const ProductSchema = mongoose.Schema({
  id:String,
  name:String,
  image:String,
  countInStack:Number
});

const Product = mongoose.model('Product', ProductSchema);

mongoose.connect(process.env.CONNECTION_STRING, 
  {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    dbName:'eshop-database'
  })
.then(() => {
console.log("database Connected...");
})
.catch((err) => {
  console.log("database wasn't Connected");
  console.log(err);
});

app.listen(4000, () => {
});
