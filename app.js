require('dotenv').config();
const express= require("express");
const app= express();
const mongoose = require('mongoose');
const cookieParser=require("cookie-parser");
const cors = require("cors");

const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const categoryRoutes=require("./routes/category");
const productRoutes=require("./routes/product");
const orderRoutes=require("./routes/order");
const paymentBRoutes= require("./routes/paymentBRoutes");

//port
const port= process.env.PORT || 8000;
//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("DB CONNECTED!!");
});

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//My routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBRoutes);


if(process.env.NODE_ENV==='production'){
    app.use(express.static('projfrontend/build'));
};
//Starting a server
app.listen(port, ()=> console.log(`Server is listening on port ${port}`));