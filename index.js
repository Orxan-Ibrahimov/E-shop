const express = require("express");
const app = express();
require("dotenv/config");
const api = process.env.API_URL;
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helper/jwt");
const errorHandler = require("./helper/error-handler");


const productRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/orders');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(authJwt());
app.use(errorHandler);
app.options('*', cors())

app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`,categoryRouter);
app.use(`${api}/users`,userRouter);
app.use(`${api}/orders`,orderRouter);

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