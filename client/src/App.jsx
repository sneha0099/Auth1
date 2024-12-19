import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Add Route and Routes
import './App.css';
import { UserContextProvider } from './Context/UserContext';
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import UpdatePassword from './components/UpdatePassword';
import ForgetPassword from './components/ForgetPassword';
import Verify from './components/Verify';

import GetUserDetails from './components/GetUserDetails';

function App() {
  

  return (
    <UserContextProvider>
      <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forget-password' element={<ForgetPassword/>}/>
        <Route path='/update-password' element={<UpdatePassword/>}/>
        <Route path='/verify-otp' element={<Verify/>}/>
      </Routes>
    </Router>
    </UserContextProvider>
    
  )
}

export default App
