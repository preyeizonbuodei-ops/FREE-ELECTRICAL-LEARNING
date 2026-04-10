
const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    adminkey: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: "Admin"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Admin", AdminSchema)