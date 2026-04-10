const mongoose = require('mongoose');


const RegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    
    matricnumber: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    phonenumber: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "trainee"
    },
    verificationCode: {
        type: Number
    },
    level: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Trainee", RegisterSchema)