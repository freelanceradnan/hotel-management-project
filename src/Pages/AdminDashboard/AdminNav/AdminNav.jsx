import { Bell, ChevronRight, CreditCard, HelpCircle, ShieldCheck, Truck, User, Ticket, Menu, Sun, Moon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../Contexts/StoreContext';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Firebase/Firebase';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/assets';
import { useAdminSettingsQuery } from '../../../Feature/ApiSlice';

const AdminNav = () => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(true);
    const { data: adminSettings } = useAdminSettingsQuery();
    const { currentUser } = useContext(StoreContext);
    const {isTheme,setIsTheme}=useContext(StoreContext)
    const [theme,setTheme]=useState('white')
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

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/');
            scrollTo(0, 0);
            toast.success('Logout success!');
        });
    };
    const changeTheme=()=>{
    const newTheme=theme==='white'?'dark':'white'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark',newTheme==='dark')
    localStorage.setItem('theme',newTheme)
    }
    const navItems = [
        { title: "Dashboard Statistics", desc: "Provide your personal details and travel documents", to: "", icon: <User size={20} /> },
        { title: "Room Management", desc: "Controls your current order", to: "roomManagement", icon: <Truck size={20} /> },
        { title: "Order Management", desc: "View saved payment methods", to: "orderManagement", icon: <CreditCard size={20} /> },
        { title: "Payment Management", desc: "View your available coupons", to: "paymentManagement", icon: <Ticket size={20} /> },
        { title: "Users Management", desc: "Update your email or password", to: "userManagement", icon: <ShieldCheck size={20} /> },
        { title: "Settings", desc: "Get customer support", to: "settings", icon: <HelpCircle size={20} /> },
    ];

 

    return (
        <div className='min-h-screen bg-[#F5F7FA] dark:bg-zinc-900 px-2 transition-colors duration-300'>
            <div className='sticky top-0 z-50'>
                {/* Header Section */}
                <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow-sm max-w-full mx-auto w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 transition-colors">
                    <Link className='flex gap-2 items-center'>
                        <img src={assets.adminLogo} alt="Logo" className='h-8 w-8' />
                        <span className='text-xl md:text-2xl font-bold uppercase tracking-tight'>Admin Dashboard</span>
                    </Link>

                    <nav id="menu" className="max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-screen max-md:w-0 transition-[width] duration-300 bg-white dark:bg-zinc-800 backdrop-blur flex-col md:flex-row flex gap-8 text-sm font-normal">
                        <button id="closeMenu" className="md:hidden text-gray-600 dark:text-gray-400 absolute top-5 right-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                            {/* {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'} */}
                            <button onClick={changeTheme}>{isTheme==='white'||theme==='white'?<h2 className='flex items-center justify-center gap-1'><Sun/>Day Mood</h2>:<h2 className='flex items-center justify-center gap-1'><Moon/>Night Mood</h2>}</button>
                        </div>

                        <Link className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition" href="#">
                            Admin
                        </Link>
                        
                        <button id="openMenu" className="md:hidden text-gray-600 dark:text-gray-400" onClick={() => {
                            setOpenMenu(!openMenu);
                            scrollTo(0, 0);
                        }}>
                            <Menu />
                        </button>
                    </div>
                </header>
            </div>

            {/* Layout Body */}
            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8'>
                <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch lg:h-[calc(100vh-80px)] lg:overflow-hidden mt-4">
                    
                    {/* Sidebar Card */}
                    <div className="w-full lg:w-[270px] shrink-0 flex flex-col lg:h-full lg:overflow-y-auto pb-2 bg-transparent">
                        {openMenu && (
                            <nav className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700/80 overflow-hidden transition-colors">
                                <ul className="flex flex-col px-2 py-6">
                                    {navItems.map((item, index) => (
                                        <NavLink
                                            key={index}
                                            to={item.to === "" ? "/admin-dashboard" : `/admin-dashboard/${item.to}`}
                                            end={item.to === ""}
                                            className={({ isActive }) =>
                                                `flex items-center justify-between p-3 lg:py-4 rounded-xl border-b border-gray-50 dark:border-zinc-700/30 transition-all duration-200 group ${
                                                    isActive
                                                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-r-4 border-r-blue-600 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-lg transition-colors ${
                                                            isActive 
                                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950' 
                                                                : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 group-hover:bg-blue-50 dark:group-hover:bg-zinc-600'
                                                        }`}>
                                                            {item.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-bold text-[15px] leading-tight transition-colors ${
                                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                            }`}>
                                                                {item.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight
                                                        size={18}
                                                        className={`transition-colors ${
                                                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                        }`}
                                                    />
                                                </>
                                            )}
                                        </NavLink>
                                    ))}

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left p-4 mt-2 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center gap-3"
                                    >
                                        <span className="rotate-180"><HelpCircle size={20} /></span>
                                        Sign out
                                    </button>
                                </ul>
                            </nav>
                        )}
                    </div>

                    {/* Main Content Router Outlet */}
                    <div className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 p-6 min-w-0 lg:h-full lg:overflow-y-auto mt-2 transition-colors">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNav;