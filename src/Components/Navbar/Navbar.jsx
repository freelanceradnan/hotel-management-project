import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { assets } from "../../assets/assets";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { StoreContext } from "../../Contexts/StoreContext";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { User } from "lucide-react";
// import { Link } from "react-router";
const Navbar = ({setIsModal,isModal}) => {
  const {currentUser,role,isLogin,loading}=useContext(StoreContext)
  const navigate=useNavigate()
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    const ref = React.useRef(null)

    const [isScrolled, setIsScrolled] = useState(false);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location=useLocation()
    const isHome=location.pathname==='/'
    const notHome=(!isHome)
    
    useEffect(() => {
      if(!location.pathname=='/'){
       setIsScrolled(false)
       return;
      }
      else{
       setIsScrolled(true)
       
      }
      setIsScrolled(prev=>location.pathname!=='/'?true:false)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
            
        };
       window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);
if (loading) {
  //if loading state available in context for user login/singup
  return (
    <nav className="h-16 w-full bg-white border-b flex items-center px-6 justify-between animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded"></div>
      <div className="flex gap-4">
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    </nav>
  );
}

    return (
      
            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-25 transition-all duration-500 z-50 ${isScrolled ? "bg-white shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4 " : "py-3 md:py-4 "} ${notHome && "bg-[#4ec2e6]"}`}>
             
        
                {/* Logo */}
                <Link to="/" onClick={()=>scrollTo(0,0)}>
                    <img src={assets.logo} className={`h-9 ${isScrolled && "invert opacity-80"}`}/>
                   
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <Link key={i} to={link.path} onClick={()=>scrollTo(0,0)} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"} `}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </Link>
                    ))}
                    <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`}>
                      Dashboard
                    </button>
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                
                    <svg className={`h-6 w-6 text-white transition-all duration-500 ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    
                    {currentUser && isLogin ?
                      <Menu as="div" className="relative ml-3">
  <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 focus:outline-none">
    <span className="sr-only">Open user menu</span>
    <div className="flex items-center gap-1.5 p-1 pr-2.5 bg-white/80 hover:bg-white transition-all duration-300 rounded-full border border-white/30 cursor-pointer group shadow-sm backdrop-blur-sm">
      {/* Avatar Circle */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-md group-hover:scale-105 transition-transform">
        M
      </div>

      {/* Text Container */}
      <div className="flex flex-col justify-center text-left select-none">
        <h2 className="text-[11px] font-bold leading-none tracking-wide text-blue-600">
          Mahim
        </h2>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">
          User
        </p>
      </div>
    </div>
  </MenuButton>

  
  <MenuItems
    modal={false}
    transition
    className="absolute right-0 z-50 mt-2 w-[350px] origin-top-right rounded-sm p-1 shadow-xl border border-white/20 ring-1 ring-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in focus:outline-none bg-white/90 text-[#121420]"
  >
    <div className="p-2">
      <MenuItem>
      <div className="flex items-center justify-between pb-2">
     <div>
       <p className="font-[700]"> Hi, Mahim</p>
       <p className="text-[14px]">mahimshaharia@gmail.com</p>
     </div>
     <p className="text-white bg-blue-800 px-2 rounded-sm text-[12px] font-semibold p-1">User</p>
      </div>
      
      </MenuItem>
      {/* usermenu--links */}
    <div className="border-b border-t border-b-slate-400 border-t-slate-400 flex flex-col gap-2">
        <MenuItem>
      
        <Link
          to="/myAccount"
          onClick={()=>scrollTo(0,0)}
          className="group flex items-center px-1 py-2 text-sm text-gray-700 rounded-lg data-focus:bg-blue-600 data-focus:text-white transition-colors font-semibold"
        >
          Account
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          to="#"
          className="group flex items-center px-1 py-2 text-sm text-gray-700 rounded-lg data-focus:bg-blue-600 data-focus:text-white transition-colors font-semibold"
        >
          List of Favorites
        </Link>
      </MenuItem>
       <MenuItem>
        <Link
          to="#"
          className="group flex items-center px-1 py-2 text-sm text-gray-700 rounded-lg data-focus:bg-blue-600 data-focus:text-white transition-colors font-semibold"
        >
          Feedback
        </Link>
      </MenuItem>
    </div>
      <div className="my-1 border-t border-gray-100" />
      <MenuItem className="">
        <button
          type="button"
          className="group flex items-center px-1 py-2 text-sm text-gray-700 rounded-lg data-focus:bg-blue-600 data-focus:text-white transition-colors font-semibold"
          onClick={() => signOut(auth)}
        >
          Sign out
        </button>
      </MenuItem>
    </div>
  </MenuItems>
</Menu>:
            <button className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`} onClick={()=>setIsModal(!isModal)}>
                        Login
                    </button>
                    }
                    {/* user-profile-menu */}
                  
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                   {/* user-profile-menu */}
                    {currentUser && isLogin &&(
                      <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                  onClick={()=>signOut(auth)}
                    type="button"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
                    )}
            {/* //menu-mobileicon */}
                   <img src={assets.menuIcon} alt="" onClick={()=>setIsMenuOpen(!isMenuOpen)} className={`${isScrolled?"invert":""} h-4`}/>
                   
                </div>
               
                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <img src={assets.closeIcon} alt="" />
                    </button>

                    {navLinks.map((link, i) => (
                        <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </Link>
                    ))}

                    <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                        Dashboard
                    </button>

                    {!currentUser && !isLogin &&(
                      <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500" onClick={()=>{
                        setIsModal(true)
                        setIsMenuOpen(false)
                        navigate("/")
                      }}>
                        Login
                    </button>
                    )}
                </div>
            </nav>
       
    );
}
export default Navbar