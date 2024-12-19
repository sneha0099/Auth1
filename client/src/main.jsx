import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <UserContextProvider>
  <App />
  </UserContextProvider>
  ,
)
