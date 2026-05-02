import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ChevronRight, User, Bell, CreditCard, Ticket, ShieldCheck, HelpCircle } from 'lucide-react';
import { auth, db } from '../../../Firebase/Firebase';
import { toast } from 'react-toastify';

const MyAccount = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
//navaitems
    const navItems = [
        { title: "Profile", desc: "Provide your personal details and travel documents", to: "", icon: <User size={20} /> },
        { title: "Communications", desc: "Control which notifications you get", to: "communications", icon: <Bell size={20} /> },
        { title: "Payment methods", desc: "View saved payment methods", to: "payments", icon: <CreditCard size={20} /> },
        { title: "Coupons", desc: "View your available coupons", to: "coupons", icon: <Ticket size={20} /> },
        { title: "Security and settings", desc: "Update your email or password", to: "security", icon: <ShieldCheck size={20} /> },
        { title: "Help and feedback", desc: "Get customer support", to: "help", icon: <HelpCircle size={20} /> },
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate("/");
            window.scrollTo(0, 0);
            toast.success("Signed out successfully");
            
        });
    };

    return (
        <div className='min-h-screen bg-[#F5F7FA]'>
            
            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-start pt-24 md:pt-32 px-4 md:px-10 lg:px-16 gap-8 pb-20'>
                
                {/* Sidebar Section */}
                <div className='w-full lg:w-[380px] shrink-0'>
                    <div className='mb-8 px-2'>
                        <h2 className='text-2xl font-bold text-gray-900'>Hi, {userData?.name || "User"}</h2>
                        <p className='text-gray-500 font-medium'>{auth?.currentUser?.email}</p>
                    </div>

                    <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="flex flex-col">
                            {navItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.to === "" ? "/myAccount" : `/myAccount/${item.to}`}
                                    // 'end' property ensures "Profile" is only active at /myAccount
                                    end={item.to === ""}
                                    className={({ isActive }) => 
                                        `flex items-center justify-between p-5 border-b border-gray-50 transition-all duration-200 group ${
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
                                                    <span className="text-xs text-gray-500 leading-tight mt-1">
                                                        {item.desc}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className={`transition-colors ${
                                                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                            }`} />
                                        </>
                                    )}
                                </NavLink>
                            ))}
                            
                            <button 
                                onClick={handleSignOut}
                                className="w-full text-left p-5 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center gap-3"
                            >
                                <span className='rotate-180'><HelpCircle size={20}/></span>
                                Sign out
                            </button>
                        </ul>
                    </nav>
                </div>

                
                <div className='w-full bg-white min-h-[500px] md:min-h-[700px] rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10'>
                    <Outlet context={[userData, setUserData]} />
                </div>

            </div>
        </div>
    );
};

export default MyAccount;