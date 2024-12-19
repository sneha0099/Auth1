import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { sendOtpMail } from "../utils/sendOtpMailer.js";
import { sendForgetPasswordMail } from "../utils/sendForgetPasswordMailer.js";
import { OtpVerification } from "../models/otpVerification.model.js";
import { COOKIE_OPTIONS, ERROR_MESSAGES, RESPONSE_MESSAGES } from "../utils/constants.js";

const handleRegister = asyncHandler(async(req,res)=>{
    const {firstname, lastname, role, email, password} = req.body

    if ([firstname, lastname, email, password].some(field => !field || field.trim() === '')) {
        throw new ApiError(409, ERROR_MESSAGES.REQUIRED_FIELDS)
    } 

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        throw new ApiError(409, ERROR_MESSAGES.USER_EXISTS);
    }

    const user = await User.create({
        firstname,
        lastname,
        role,
        email,
        password,
        verified: false
    })


    const isUserCreated = await User.findById(user._id).select('-password -lastname');

    if (!isUserCreated) {
        throw new ApiError(400, "something went wrong while registering user")
    }

    try {
        await sendOtpMail(user._id, user.email)
    } catch (error) {
        throw new ApiError(500 , ERROR_MESSAGES.OTP_FAILED)
    }

    return res.status(200).json(
        new ApiResponse(200 , {user: isUserCreated} , RESPONSE_MESSAGES.USER_REGISTERED)
    )
})

const handleVerify = asyncHandler(async(req,res)=>{
    const {otp, userId} = req.body

    if (!otp || !userId) {
        throw new ApiError(400 , ERROR_MESSAGES.EMPTY_DETAILS)
    }

    const otpVerificationRecord =await OtpVerification.findOne({userId})
    if (!otpVerificationRecord) {
        throw new ApiError(400 , ERROR_MESSAGES.OTP_EXPIRED)
    }

    if (otp === otpVerificationRecord.otp) {
        await OtpVerification.deleteOne({userId});

        const user = await User.findById(userId);
    if(!user){
        throw new ApiError(400 , ERROR_MESSAGES.USER_NOT_FOUND)
    }

    await User.updateOne({_id: userId} , {verified: true})

    const updatedUser = await User.findById(userId);

    // Generate a token for the updated user
    const token = updatedUser.generateToken();

    // Send the response with updated user info and the token
    return res
        .status(200)
        .cookie("token", token, COOKIE_OPTIONS)
        .json(new ApiResponse(200, { user: updatedUser, token }, RESPONSE_MESSAGES.USER_VERIFIED));
}

throw new ApiError(400, ERROR_MESSAGES.OTP_INVALID);

})

const handleLogin = asyncHandler(async(req,res)=>{
    const {email , password} = req.body

    if ([email , password].some(field=> field?.trim()==="")) {
        throw new ApiError(400 , ERROR_MESSAGES.REQUIRED_FIELDS)
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(401 , ERROR_MESSAGES.USER_NOT_FOUND)
    }

    if (!user.verified) {
        throw new ApiError(404 , ERROR_MESSAGES.USER_NOT_VERIFIED)
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect)
        throw new ApiError(401, ERROR_MESSAGES.PASSWORD_INCORRECT);

    const token = await user.generateToken();

    res
        .status(200)
        .cookie("token", token, COOKIE_OPTIONS)
        .json(new ApiResponse(200, { user, token }, RESPONSE_MESSAGES.USER_LOGGED_IN));
});

export const handleLogout = asyncHandler(async (req, res) => {
    res
        .clearCookie("token", COOKIE_OPTIONS)
        .status(200)
        .json(new ApiResponse(200, {}, RESPONSE_MESSAGES.USER_LOGGED_OUT));
});

const handleResendOtp = asyncHandler(async (req, res) => {
    const { userId, email } = req.body;

    if (!email || !userId)
        throw new ApiError(400, ERROR_MESSAGES.EMPTY_DETAILS);

    const user = await User.findById({ _id: userId });
    if (!user)
        throw new ApiError(400, ERROR_MESSAGES.USER_NOT_FOUND);

    const isOtpVerificationRecord = await OtpVerification.findOne({ userId });
    if (isOtpVerificationRecord)
        await OtpVerification.deleteOne({ userId });

    try {
        await sendOtpMail(userId, email);
    } catch (error) {
        throw new ApiError(500, ERROR_MESSAGES.OTP_FAILED);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { userId }, RESPONSE_MESSAGES.OTP_SENT));
});

const handleUpdatePassword = asyncHandler(async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword)
        throw new ApiError(400, ERROR_MESSAGES.EMPTY_DETAILS);

    const user = await User.findOne({ _id: userId });
    if (!user)
        throw new ApiError(400, ERROR_MESSAGES.USER_NOT_FOUND);

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { userId }, RESPONSE_MESSAGES.PASSWORD_RESET_SUCCESS));
});

const getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json(new ApiResponse(200, { user }, RESPONSE_MESSAGES.USER_FETCHED));
});

const handleForgetPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;

    if (!email) {
        throw new ApiError(403, ERROR_MESSAGES.EMPTY_DETAILS)
    }

    const user = await User.findOne({email})

    if (!user) {        
        throw new ApiError(404, ERROR_MESSAGES.USER_NOT_FOUND)
    }

    await sendForgetPasswordMail(email);

    return res
        .status(200)
        .json(new ApiResponse(200 , {user} , RESPONSE_MESSAGES.PASSWORD_RESET_EMAIL_SENT))
})


export {handleRegister , handleVerify , handleLogin, handleResendOtp, handleUpdatePassword , getUserDetails, handleForgetPassword}






















// import bcrypt from 'bcryptjs';

// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// import User from '../models/user.model.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const {JWT_SECRET, EMAIL_USER, EMAIL_PASS} = process.env;

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth:{
//         user: EMAIL_USER,
//         pass: EMAIL_PASS
//     }

// })

// const sendOTP = async(email,otp) =>{
//     await transporter.sendMail({
//         from: EMAIL_USER,
//         to: email,
//         subject: 'Your otp code',
//         text: `Your otp is ${otp}`
//     })
// }

// const register = async(req,res)=>{
//     console.log(req.body);
    
//     const {email, password} = req.body
//     console.log(email);
    
 
//     try {
//         let user = await User.findOne({email})
//         if (user) {
//             return res.status(400).send("user already exists")
//         }

//         const hashedPassword = await bcrypt.hash(password,10)

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         user = new User({
//             email,
//             password: hashedPassword,
//             otp,
//             otpExpires: Date.now() + 600000

//         })
//         await user.save();
//         console.log(user);
        

//         await sendOTP(email,otp)

//         res.status(200).send("registered successfully. OTP sent to email")
//     } catch (error) {
//         res.status(500).send("Error in registration")
//     }

// }

// const verifyOtp = async(req,res)=>{
//     const{email,otp} = req.body

//     try {
//         const user = await User.findOne({email})
//         if (!user) {
//             return res.status(400).send("User not found")
//         }

//         if (user.otp!==otp || user.otpExpires< Date.now()) {
//             return res.status(400).send("Invalid otp")
//         }

//         user.verified = true;
//         user.otp = undefined
//         user.otpExpires = undefined

//         await user.save()

//         res.status(200).send("Otp verified successfully")
//     } catch (error) {
//         res.status(500).send("Error in verifying otp")
//     }
// }

// const resendOtp = async(req,res)=>{
//     const {email} = req.body
//     console.log(email);
    

//     try {
//         const user = await User.findOne({email})
//         if (!user) {
//             return res.status(400).send("cant find user")
//         } 
        
//         console.log("hie");
        
//         const otp = Math.floor(100000 + Math.random()*900000).toString()
//         console.log("hi");
        

//         user.otp = otp;
//         console.log(otp);
        
//         user.otpExpires = Date.now() + 600000
//         user.save();

//         await sendOTP(email,otp)

//         res.status(200).send("otp resent to mail")

//     } catch (error) {
//         console.log("error is",error);
        
//         res.status(500).send("error resending otp")
//     }
// }

// const login = async(req,res)=>{
//     const {email , password} = req.body

//     try {
//         const user = await User.findOne({email})
//         if (!user) {
//             return res.status(400).send("user not found")
//         }
//         if (!user.verified) {
//             return res.status(400).send("user is not verified")
//         }
    
//         const isMatch = bcrypt.compare(password , user.password)
//         if (!isMatch) {
//             return res.status(400).send("password dooesnt match")
//         }

//         const token = jwt.sign({UserId: user._id} , JWT_SECRET , {expiresIn: '7d'})
//         res.status(200).send({token})

//     } catch (error) {
//         res.status(500).send("Error while logging in")
//     }

// }

// const forgotpassword = async(req,res)=>{
//     const {email} = req.body;

//     try {
//         const user = await User.findOne({email})
//         if (!user) {
//             return res.status(400).send("user not found")
//         }
    
//         const otp = Math.floor(100000 + Math.random()*900000).toString()
    
//         user.otp = otp
//         user.otpExpires = Date.now()+600000
    
//         user.save()
    
//         await sendOTP(email,otp)
    
//         res.status(200).send("otp sent succesfully to reset password")
//     } catch (error) {
//         res.status(500).send("Error occured while sending an otp")
//     }
// }

// const resetPassword = async(req,res)=>{
//     const {email, otp, newPassword} = req.body

//     try {
//         const user = await User.findOne({email})

//         if (!user) {
//             return res.status(400).send("user not found")    
//         }
//         if (user.otp !== otp || user.otpExpires < Date.now()) {
//             return res.status(400).send("Invalid or expired OTP");
//         }
        
//         user.password = await bcrypt.hash(newPassword, 10);
//         user.otp = undefined;
//         user.otpExpires = undefined;
//         await user.save();

//         res.status(200).send("Password reser successfully")
//     } catch (error) {
//         console.log(error);
        
//         res.status(500).send("Error resetting password")
//     }
// }
// export {register, verifyOtp, resendOtp, login, forgotpassword, resetPassword}