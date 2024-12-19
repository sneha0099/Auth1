import React, { useState, useContext, useEffect, useId } from "react";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { ResendOtp } from "../utils/ResendOtp";


function Verify() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false)

  const {userDetails} = useContext(UserContext)
 
  const userId = userDetails?._id
  const email = userDetails?.email

  console.log(userDetails , 'verifypage');
  console.log(email , userId , 'data');
  
  

  useEffect(() => {
    if (userDetails) {
      console.log("User details changed:", userDetails); // Logs user details if it's available
    } else {
      console.log("User details not available"); // Logs a fallback message
    }
  }, [userDetails]);

  const handleChange = (e) => setOtp(e.target.value)

  const handleResendOtp = () => {
    if (isResending) return; // Prevent multiple resend requests
    setIsResending(true)
    ResendOtp({ userId, email, setIsResending, setMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!userId) {
        throw new Error("user not found")
      }

      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
      otp,
      userId
      })
      console.log(userId , otp , 'try block');
      
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error?.data?.message  || "verification failed")
    }
  }

  // const resendOtp = async () => {
  //   if(isResending) return;

  //   setIsResnding(true);

  //   try {
  //     const response = axios.post("http://localhost:5000/api/auth/resend-otp", {
  //       UserId,
  //       email
  //     });
  //     setMessage(response.data.message)
  //   } catch (error) {
  //     setMessage(error.response?.data?.message)
  //   }
  //   setIsResnding(false)
  // }

  return (
    <form className="flex flex-col justify-center items-center"
    onSubmit={handleSubmit}>
      <h1>verify otp</h1>
      <input
      type="text"
      name="otp"
      placeholder="enter otp"
      value={otp}
      onChange={handleChange}
      required
      />

      <button type="submit">verify</button>

        <button type="button" onClick={handleResendOtp} >
            {isResending? "Resending.." : "Resend OTP"}
        </button>
      {message && <p>{message}</p>}
    </form>
  )
}

export default Verify