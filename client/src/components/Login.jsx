import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login" , formData);
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error.response?.data?.message)
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen w-screen bg-gray-300'>
        <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xs  ">
            <h1 className='text-xl font-bold text-center'>Login</h1>

            <label htmlFor='email' name='email' className='block font-bold text-sm mt-4 mb-1'>email</label>
            <input 
            type='text'
            name='email'
            placeholder='email'
            onChange={handleChange}
            className='bg-slate-300 rounded-sm py-2 px-1 w-full' 
            required/>

            <label htmlFor='password' name='password' className='block font-bold text-sm mt-4 mb-1'>password</label>
            <input 
            type='text' 
            name='password'
            placeholder='password'
            onChange={handleChange}
            className='bg-slate-300 rounded-sm py-2 px-1 w-full'
            required/>

            <button
            type='submit' className='block bg-gray-500 py-1 px-6 rounded mt-5 mb-2 w-full'>login</button>
            <Link to="/forget-password" className='underline decoration-gray-600'>Forgot Password?</Link>
          {message && <p>{message}</p>}
        </form>
    </div>  
  )
}

export default Login