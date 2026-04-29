import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { StoreContextProvider } from './Contexts/StoreContext.jsx'
import { Provider } from 'react-redux'
import  {store}  from './Store/Store.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
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
    </Provider>
  </StrictMode>,
)
