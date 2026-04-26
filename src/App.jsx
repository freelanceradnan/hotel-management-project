import { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router'
import Home from './Pages/Home/Home';
import SignupModal from './Components/SignupModal/SignupModal';




function App() {
  //hide admin dashboard
const isAdminPath=useLocation().pathname.includes("admin-dashboard")
const [isModal,setIsModal]=useState(false)

  return (
  <>
  {/* navbar */}
   {!isAdminPath && <Navbar setIsModal={setIsModal} isModal={isModal}/>}
   {/* all-routes */}
   <div className="min-h-[70vh]">
    <Routes>
    <Route path="/" element={<Home/>}/>
   </Routes>
  {isModal &&  <SignupModal setIsModal={setIsModal}/>}
   </div>
  </>
  )
}

export default App
