import { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router'
import Home from './Pages/Home/Home';
import SignupModal from './Components/SignupModal/SignupModal';
import Footer from './Components/Footer/Footer';
import Rooms from './Pages/AllRooms/Rooms';
import RoomDetails from './Pages/RoomDeatils/RoomDetails';




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
    {/* all-routes */}
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/rooms" element={<Rooms/>}/>
    <Route path="/rooms/:id" element={<RoomDetails/>}/>
   </Routes>
   {/* universal-footer-section */}
   <div>
     <Footer/>
   </div>
   {/* singup modals */}
  {isModal &&  <SignupModal setIsModal={setIsModal}/>}
  
 
   </div>
  </>
  )
}

export default App
