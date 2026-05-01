import { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router'
import Home from './Pages/Home/Home';
import SignupModal from './Components/SignupModal/SignupModal';
import Footer from './Components/Footer/Footer';
import Rooms from './Pages/AllRooms/Rooms';
import RoomDetails from './Pages/RoomDeatils/RoomDetails';
import MyAccount from './Pages/UserAccount/MyAccount/MyAccount';
import MyProfile from './Components/UserAccount/MyProfile';




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

    
    <Route path="/myAccount" element={<MyAccount/>} >
    
    <Route path="" element={<MyProfile />} />
    <Route path="communications" element={<h3 className=''>this is the heavy!</h3>}/>
    <Route path="payments" element={<h3 className=''>this is the marhum!</h3>}/>
    <Route path="coupons" element={<h3 className=''>this is the next!</h3>}/>
    <Route path="security" element={<h3 className=''>this is the next!</h3>}/>
    <Route path="help" element={<h3 className=''>this is the next!</h3>}/>
    </Route>
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
