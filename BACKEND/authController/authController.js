
const { validateUserRegister, validateAdmin } = require("../middlewares/validate");
const Trainee = require('../modules/users');
const Admin = require('../modules/admin');
const jwt = require('jsonwebtoken');
const { ComparePassword,DoHash } = require('../utils/hashing')
require('dotenv').config();

const verificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.userRegister = async (req, res) => {
    const { username, email, level, department, matricnumber, phonenumber, role} = req.body;

    try {
        const { error } = await validateUserRegister.validate({ username, email, level, department, matricnumber, phonenumber});

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await Trainee.findOne({ email, matricnumber });
        if (existingUser) {
            return res.status(401).json({ success: false, message: "User already exists with this email and matric number" });
        }

        
        const code = verificationCode()
        const newTrainee = new Trainee({
            username,
            email,
            matricnumber,
            level,
            role,
            phonenumber,
            department,
            verificationCode: code
        });

        // Generate code
        ;
        const result = await newTrainee.save();
        res.status(201).json({
         message: "Registration successful",
         verificationCode: newTrainee.verificationCode
      });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
        console.log(error);
    }
}

exports.adminRegister = async ( req, res ) => {
    const SECRETE = process.env.ADMIN_SECRET 
    const { username, adminkey, secret, role} = req.body

    try {
        const { error } = await validateAdmin.validate({ username, adminkey });

        if(error) {
          return res.status(401).json({ success: false, message: "invalid credentials" })  
        }

        
        if (secret !== SECRETE) {
          return res.status(401).json({ success: false, message: "invalid secrete" })
        }

        const existingAdmin = await Admin.countDocuments()
        if(existingAdmin > 1) {
            return res.status(401).json({ success: false, message: "Amin already exists. Only Two admin is permited" })
        }

        const hashAdminKey = await DoHash(adminkey, 12)

        const newAdmin = new Admin({
            username,
            adminkey: hashAdminKey,
            role
        });

        const result = await newAdmin.save()
        result.adminkey = false;
        console.log(result)
        res.status(200).json({ success: true, message: "Admin registered successfully" })

    
    } catch (error) {
        console.log(error)
    }
}


// Admin Login
exports.adminLogin = async (req, res) => {
  const { adminkey, username } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    const match = await ComparePassword(adminkey, existingAdmin.adminkey);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWTs
    const accessToken = jwt.sign(
      { adminId: existingAdmin._id, username: existingAdmin.username, role: existingAdmin.role },
      process.env.ACCESS_TOKEN_SECRET,   
      { expiresIn: "12m" }
    );

    const refreshToken = jwt.sign(
      { adminId: existingAdmin._id, user: { username: Admin.username }, role: existingAdmin.role },
      process.env.REFRESH_TOKEN_SECRET,  
      { expiresIn: "8d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({ success: true, token: accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET); 
    const existingAdmin = await Admin.findById(decoded.adminId);         

    if (!existingAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const newAccessToken = jwt.sign(
      { adminId: existingAdmin._id, role: existingAdmin.role, username: existingAdmin.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12m" } 
    );

    res.status(200).json({
      success: true,
      data: newAccessToken,
      user: {
        adminId: existingAdmin._id,
        username: existingAdmin.username,
        role: existingAdmin.role,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.Logout = async ( req, res ) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        return res.status(200).json({ success: true, message: "Logged Out successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "server error" })
    }
}

exports.getallTrainees = async (req, res) => {
    try {
        const getTrainee = await Trainee.find().select("-password");
        if(!getTrainee){
            return res.status(401).json({ success: false, message: "No Trainee registered" })
        };

        console.log(getTrainee)
        res.status(200).json({ success: true, data: getTrainee })
    } catch (error) {
        console.log(error)
    }
}

exports.getOneTrainee = async (req, res) => {
  const { traineeId} = req.params;
  try {
    const getonetrainee = await Trainee.findById(traineeId).select("-password"); 
    if (!getonetrainee) {
      return res.status(404).json({ success: false, message: "Trainee not found" });
    }

    console.log(getonetrainee)
    res.status(200).json({
      success: true,
      data: getonetrainee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.deleteTrianee = async ( req, res ) => {
    const { traineeId } = req.params

    try {
        const deletetrainee = await Trainee.findByIdAndDelete(traineeId)
        if(!deletetrainee) {
            return res.status(401).json({ success: false, message: "failed delete user" })
        }
        console.log(`You deleted this user ${deletetrainee}`)
        res.status(200).json({ success: true, message: "Trainee deleted successfully" })
    } catch (error) {
        console.log(error)
    }
}