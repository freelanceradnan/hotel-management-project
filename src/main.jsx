import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { StoreContextProvider } from './Contexts/StoreContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContextProvider>
      <BrowserRouter>
    <ToastContainer 
      position="top-center"
      autoClose={1000}
      theme="colored"
    />
    <App />
    </BrowserRouter>
    </StoreContextProvider>
  </StrictMode>,
)
