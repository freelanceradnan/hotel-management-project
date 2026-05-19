import { Bell, ChevronRight, CreditCard, HelpCircle, ShieldCheck, Truck, User,Ticket, Menu} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Firebase/Firebase';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/assets';

const AdminNav = () => {
    const navigate=useNavigate()
    const [openMenu,setOpenMenu]=useState(true)
    
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setOpenMenu(true);
    }
  };
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

    const {currentUser}=useContext(StoreContext)
    const handleSignOut=()=>{
     signOut(auth).then(()=>{
        navigate('/')
        scrollTo(0,0)
        toast.success('Logout success!')
     })
    }
    const navItems = [
        { title: "Dashboard Statistics", desc: "Provide your personal details and travel documents", to: "", icon: <User size={20} /> },
        { title: "Room Management", desc: "Controls your current order", to: "roomManagement", icon:  <Truck size={20}/>},
        { title: "Order Management", desc: "View saved payment methods", to: "orderManagement", icon: <CreditCard size={20} /> },
        { title: "Payment Management", desc: "View your available coupons", to: "paymentManagement", icon: <Ticket size={20} /> },
        { title: "Users Management  ", desc: "Update your email or password", to: "userManagement", icon: <ShieldCheck size={20} /> },
        { title: "Settings", desc: "Get customer support", to: "settings", icon: <HelpCircle size={20} /> },
        
    ];

    return (
        <div className='min-h-screen bg-[#F5F7FA] px-2'>
        <div className='sticky top-0 z-50'>
            
           <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-full mx-auto w-full bg-white ">
    <Link className='flex gap-2 items-center'>
        <img src={assets.adminLogo} alt="Logo" className='h-8 w-8' />
        <span className='text-2xl font-semibold uppercase'>Admin Dashboard</span>
    </Link>
    <nav id="menu" className="max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-screen max-md:w-0 transition-[width] duration-300 bg-white md:bg-transparent backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal">
      
        <button id="closeMenu" className="md:hidden text-gray-600 absolute top-5 right-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor"  viewBox="0 0 24 24" >
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </nav>
    <div className="flex items-center space-x-4">
        {/* <!-- Theme Toggle Button --> */}
        {/* <button className="size-8 flex items-center justify-center hover:bg-gray-100 transition border border-slate-300 rounded-md">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511" stroke="#353535" />
            </svg>
        </button> */}
        <Link className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition" href="#">
            {/* Sign up */}Admin
        </Link>
        {/* <!-- Hamburger Menu Button --> */}
        <button id="openMenu" className="md:hidden text-gray-600" onClick={()=>{
            setOpenMenu(!openMenu)
            scrollTo(0,0)
        }}>
            <Menu />
        </button>
    </div>
</header>


        </div>


{/* down part */}



            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8'>
                
                {/* Sidebar Section */}
                {/* Outer Layout Wrapper: Constrains height on large screens to decouple the scrolling tracks */}
<div className="w-full flex flex-col lg:flex-row gap-8 items-stretch lg:h-[calc(100vh-80px)] lg:overflow-hidden">
  
 
  <div className="w-full lg:w-[270px] shrink-0 flex flex-col lg:h-full lg:overflow-y-auto pb-2 bg-[#FFFFFF]" >
    

    {openMenu && (
      <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="flex flex-col px-2 py-6">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to === "" ? "/admin-dashboard" : `/admin-dashboard/${item.to}`}
              end={item.to === ""}
              className={({ isActive }) => 
                `flex items-center justify-between p-2 lg:py-4 border-b border-gray-50 transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-50/50 border-r-4 border-r-blue-600' 
                    : 'hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive ? 'text-blue-600 bg-blue-100' : 'text-gray-500 bg-gray-100 group-hover:bg-blue-50'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold text-[15px] leading-tight transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                        {item.title}
                      </span>
                      
                    </div>
                  </div>
                  <ChevronRight 
                    size={18} 
                    className={`transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`} 
                  />
                </>
              )}
            </NavLink>
          ))}
          
          <button 
            onClick={handleSignOut}
            className="w-full text-left p-5 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center gap-3"
          >
            <span className="rotate-180"><HelpCircle size={20}/></span>
            Sign out
          </button>
        </ul>
      </nav>
    )}
  </div>

  <div className="w-full bg-[#FFFFFF] rounded-2xl shadow-sm border border-gray-100 p-6 min-w-0 lg:h-full lg:overflow-y-auto mt-2">
    <Outlet />
  </div>
</div>

            </div>
        </div>
    );
};

export default AdminNav;