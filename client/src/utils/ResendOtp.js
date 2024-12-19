import axios from "axios";

const ResendOtp = async ({ email, UserId, setIsResending, setMessage }) => {
  
  setIsResending(true);

  try {
    const response = await axios.post("http://localhost:5000/api/auth/resend-otp", {
      UserId,
      email,
    });

    
    setMessage(response.data.message);
  } catch (error) {
    
    setMessage(error.response?.data?.message || "Error sending OTP");
  } finally {
    
    setIsResending(false);
  }
};

export { ResendOtp };
