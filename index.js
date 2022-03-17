const express = require("express");
const app = express();
require("dotenv/config");
const api = process.env.API_URL;
const morgan = require("morgan");
const mongoose = require("mongoose");

const productRouter = require('./routers/products');

app.use(express.json());
app.use(morgan('tiny'));

app.use(`${api}/products`,productRouter);

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

app.listen(3000, () => {
});