import express from "express"

import { handleRegister , handleVerify, handleLogin , handleResendOtp, handleUpdatePassword, getUserDetails, handleForgetPassword} from "../controllers/user.controller.js"

const router = express.Router();

router.post('/register', handleRegister);
router.post('/verify-otp', handleVerify);
router.post('/resend-otp', handleResendOtp);
router.post('/login', handleLogin);
router.post('/details', getUserDetails);
router.post('/update-password', handleUpdatePassword);
router.post('/forget-password', handleForgetPassword);


export default router   

