import React from 'react'
import {Link} from 'react-router-dom'

function Home() {
    return (
        <div className='h-full'>
            <div className='flex justify-between items-center px-4 py-2 bg-gray-200'>
                <div className='font-bold text-lg'>Auth.</div>

                <div className='flex gap-2'>
                    <button className='bg-green-500 text-black rounded-md h-9 w-24'>
                    <Link to="/register">Register</Link>
                    </button>
                    <button className='bg-green-500 text-black rounded-md h-9 w-24'>
                    <Link to="/login">Login</Link>
                    </button>
                </div>
            </div>

            <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-300 to-green-300 text-black">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to AuthSite</h1>
                    <p className="text-lg mb-6 max-w-md">
                        Your secure gateway to seamless authentication. Register now to unlock access or log in to continue where you left off.
                    </p>
                    <div className="flex gap-4 mb-16">
                        <button className="bg-white text-blue-500 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition duration-300">
                            <Link to="/register">Register</Link>
                        </button>
                        <button className="bg-transparent border-2 border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-blue-500 transition duration-300">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home