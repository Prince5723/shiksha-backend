const express = require("express");
const cors = require("cors")
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/addCourse");
const db = require('./db/index')
const dotenv = require('dotenv')

const app = express();

app.use(cors());

app.use(express.json())


dotenv.config({
    path: './.env'
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

db.connectDB()
    .then(() => {
        app.listen(8000, () => {
            console.log("Server is running at port 8000");
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })