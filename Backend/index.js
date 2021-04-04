const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const errorMiddleware = require("./middleware/error");
const passengerRouter = require("./routes/passengerRouter");
const driverRouter = require("./routes/driverRouter");
const userRouter = require("./routes/loginRouter");
const authMiddleware = require("./middleware/auth");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passenger

app.use("*", authMiddleware);
app.use("/passenger",passengerRouter).use("/driver",driverRouter).use("/user",userRouter);
app.use(errorMiddleware);
//driver


const port = process.env.PORT;
const mongodbConnectionString = process.env.DB_CONNECTION;

mongoose.connect(mongodbConnectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    }).then(result=>{
    console.log("Connected to mongodb");
    server.listen(port,()=> console.log("Server is running at port "+ port));
}).catch(err=>{
    console.log(err);
})



