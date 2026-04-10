
const express = require('express');
const cors = require('cors');
const CONNECTDB = require('./connectDB/connectDB');
const router = require ('./routes/authRouter.js')
const cookieParser = require('cookie-parser')
require('dotenv').config();
// intialize express and middlewares
const app = express()
app.use(express.json());
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://free-electrical-learnings.onrender.com" // for production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());



// main route
app.get('/', ( req, res ) => {
    res.status(200).json({ success: true, message: "Welcome to the Home Page" })
})
app.use('/api/auth/v1/user/', router)

// connect MongoGB
const CONNECT_URI = process.env.MONGODB_URI || '127.0.0.1:27017/ELECTRICAL-TRAINING'
CONNECTDB(CONNECT_URI)


// starts the server 
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})