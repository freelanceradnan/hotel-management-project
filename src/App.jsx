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
import Communications from './Pages/UserAccount/Communications/Communications';
import Payments from './Pages/UserAccount/myPayment/MyPayment';
import MyPayment from './Pages/UserAccount/myPayment/MyPayment';
import MyCoupon from './Pages/UserAccount/myCoupon/MyCoupon';
import Security from './Pages/UserAccount/MySecurity/Security';
import ChangeEmailBasic from './Pages/UserAccount/MySecurity/Security';
import Feedback from './Pages/UserAccount/MyFeedback/Feedback';
import Favorites from './Pages/Favourties/Favorites';
import UserPrivate from './Components/UserPrivateRoute/UserPrivate';
import Checkout from './Pages/RoomCheckout/Checkout';
import Payment from './Pages/Payment/Payment';
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess';
import PreOrdered from './Pages/PreOrdered/PreOrdered';
import NotFound from './Pages/NotFound/NotFound';




function App() {
  const location=useLocation()
  
  //hide admin dashboard
const isAdminPath=useLocation().pathname.includes("admin-dashboard")
const [isModal,setIsModal]=useState(false)

//footer hide and navbar hide logic
const allRoutes = [
    "/", "/rooms", "/payment", "/preorder", "/order-success", "/favourites", "/myAccount"
  ];
const isKnownRoute = allRoutes.some(path => location.pathname === path) || 
                       location.pathname.startsWith("/rooms/") || 
                       location.pathname.startsWith("/myAccount/");
const showFooter = !isAdminPath && isKnownRoute;
  return (
  <>
  {/* navbar */}
   {!isAdminPath && showFooter &&<Navbar setIsModal={setIsModal} isModal={isModal}/>}
   {/* all-routes */}
   <div className="min-h-[70vh]">
    {/* all-routes */}
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/rooms" element={<Rooms/>}/>
    <Route path="/rooms" element={<Rooms/>}/>
    <Route path="/rooms/checkout/:id" element={
      <UserPrivate>
        <Checkout/>
      </UserPrivate>
    }/>
    <Route path="/payment" element={
      <UserPrivate>
        <Payment/>
      </UserPrivate>
    }/>
    <Route path="/preorder" element={
      <UserPrivate>
        <PreOrdered/>
      </UserPrivate>
    }/>
    <Route path="/order-success" element={
      <UserPrivate>
      <OrderSuccess/>
    </UserPrivate>}/>
    <Route path="/rooms/:id" element={
      
      <RoomDetails/>
   }/>
    <Route path="favourites" element={
      <UserPrivate>
        <Favorites/>
      </UserPrivate>
    }/>
     
    
    <Route path="/myAccount" element={
      <UserPrivate>
        <MyAccount/>
      </UserPrivate>
    } >
    
    <Route path="" element={<MyProfile />} />
    <Route path="communications" element={<Communications/>}/>
    <Route path="payments" element={<MyPayment/>}/>
    <Route path="coupons" element={<MyCoupon/>}/>
    <Route path="security" element={<Security/>}/>
    <Route path="help" element={<Feedback/>}/>
    </Route>
    <Route path="*" element={<NotFound />} />
   </Routes>
   {/* universal-footer-section */}
   
    {showFooter &&
    <div>
     <Footer/>
   </div>
    }
   
   {/* singup modals */}
  {isModal &&  <SignupModal setIsModal={setIsModal}/>}
  
 
   </div>
  </>
  )
}

export default App
