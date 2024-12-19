import React ,{ useState, useContext, useEffect} from "react";
import axios from "axios";
import { UserContext, } from "../Context/UserContext";

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    role: "user", // Default role
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const {userDetails, setUserDetails} = useContext(UserContext);
  const {email, setEmail} = useContext(UserContext)

  console.log(email , 'reg');
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  useEffect(() => {
    console.log("Updated context in Register after setting:", userDetails, email);
  }, [userDetails, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      setUserDetails(response.data.data.user);
      setEmail(response.data.data.user.email);
      console.log("Context updated in Register:", userDetails, email);
      console.log("API response:", response.data.data.user); // Logs the correct user data

      
      setMessage(response.data.message);
      // window.location.href = "/verify-otp";
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name
          </label>  
          <input
            type="text"
            name="firstname"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
        >
          Register
        </button>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
}

export default Register;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user'); // Default role is 'user'
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ firstname, lastname, email, password, role }),
//       });

//       if (response.ok) {
//         navigate('/login'); // Redirect to Login page after successful registration
//       } else {
//         alert('Registration failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h1>
//         <form className="space-y-4" onSubmit={handleRegister}>
//           <div>
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               type="text"
//               placeholder="First Name"
//               value={firstname}
//               onChange={(e) => setFirstname(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               type="text"
//               placeholder="Last Name"
//               value={lastname}
//               onChange={(e) => setLastname(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-600">Role</label>
//             <select
//               className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//           <div>
//             <button
//               type="submit"
//               className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;
