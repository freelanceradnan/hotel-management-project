import { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router'
import Home from './Pages/Home/Home';




function App() {
  //hide admin dashboard
const isAdminPath=useLocation().pathname.includes("admin-dashboard")

  return (
  <>
  {/* navbar */}
   {!isAdminPath && <Navbar/>}
   {/* all-routes */}
   <div className="min-h-[70vh]">
    <Routes>
    <Route path="/" element={<Home/>}/>
   </Routes>
   </div>
  </>
  )
}

export default App
