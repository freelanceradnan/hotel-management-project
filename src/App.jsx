import { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { useLocation } from 'react-router'




function App() {
  //hide admin dashboard
const isAdminPath=useLocation().pathname.includes("admin-dashboard")

  return (
  <>
   {!isAdminPath && <Navbar/>}
  </>
  )
}

export default App
