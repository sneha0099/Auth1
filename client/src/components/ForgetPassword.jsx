import React, { useState } from 'react'
import axios from 'axios'

function ForgetPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleForgetPassword = async() => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:5000/api/auth/forget-password",{email})
            setMessage(response.data.message)
        } catch (error) {
            setMessage(error.response?.data?.message || "failed to send reset link")
        }
    }
    
    return (
        <div className='flex flex-col justify-center items-center w-screen h-screen'>
            <form className='flex flex-col w-full max-w-sm'
            onSubmit={handleForgetPassword}>    
                <h2>Enter your email so that we can send you reset link</h2>

                <label htmlFor='email' name='email'>Email</label>
                <input 
                type='email'
                name='email' 
                placeholder='enter your email'
                value={email}
                onChange={handleChange}
                required/>

                <button type='submit'>Submit</button>

            </form>
            {message&& <p>{message}</p>}

        </div>
    )
}

export default ForgetPassword