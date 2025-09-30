const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db.js");
const color = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

dotenv.config();

connectDB();//connect database

const app = express();

app.use(express.json()); //to accept json data





// let port = 5000;

//create first api
app.get("/", (req, res) => {
    res.send("API is Running");
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//error middleware
app.use(notFound);
app.use(errorHandler);

// //show all chat
// app.get("/api/chats", (req, res) => {
//     res.send(chats)
// });

// //find single chat through id
// app.get("/api/chats/:id", (req, res) => {
//     // console.log(req.params.id);
//     const singleChat = chats.find((c) => c._id === req.params.id);
//     res.send(singleChat);
// });

const PORT = process.env.PORT || 5000

app.listen(5000,console.log(`Server start on port ${PORT}`.yellow.bold))

