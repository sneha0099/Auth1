import React, { useContext, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../Context/UserContext'

function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const {userDetails} = useContext(UserContext)

  const UserId = userDetails?.id
  
  const handleChange = (e) =>{
    setPassword(e.target.value)
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault(); // Prevents form reload
    try {
      if (!UserId) {
        throw new Error("User not found. Please log in again.");
      }

      const response = await axios.post("http://localhost:5000/api/auth/update-password", {
        UserId,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Password update failed. Please try again.");
    }
  };

  return (
    <div>
    <form onSubmit={handleUpdatePassword}>
      <label name="password">Enter your new password</label>
      <input 
      type='password'
      name='password'
      placeholder='enter new password'
      value={password}
      onChange={handleChange}
      required/>
      <button type='submit'>submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default UpdatePassword