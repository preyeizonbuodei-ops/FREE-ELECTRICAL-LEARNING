
const mongoose = require('mongoose')

const ConnectDB = async ( req, res ) => {
    const uri = process.env.MONGODB_URI;

    try {
        const connect = await mongoose.connect(uri)
        if(!connect) {
            return res.status(401).json({ success: false, message: "unable to connect" })
        }
        console.log("database connected ")
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = ConnectDB;

