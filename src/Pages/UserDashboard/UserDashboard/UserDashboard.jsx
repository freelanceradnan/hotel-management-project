import {
  BookCheck,
  ChevronRight,
  FileChartColumn,
  SmartphoneNfc,
  SquareKanban,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import React from "react";
import { Link, NavLink } from "react-router";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  const NavItems = [
    {
      title: "My Statistics",
      disc: "OverView Your Statics",
      to: "",
      icon: <FileChartColumn size={15} />,
    },
    {
      title: "Manage Products",
      disc: "Manage Confortable Products",
      to: "/manage",
      icon: <SquareKanban size={15} />,
    },
    {
      title: "Manage Bookings",
      disc: "Manage Booking with Tracking",
      to: "/bookings",
      icon: <BookCheck size={15} />,
    },
    {
      title: "Revenue Report",
      disc: "Checkout Your Live Revenue",
      to: "/revenue",
      icon: <BookCheck size={15} />,
    },
    {
      title: "Contact Admin",
      disc: "Contact Your Web Admin",
      to: "/contact-admin",
      icon: <SmartphoneNfc size={15} />,
    },
  ];
  return (
    <div className="w-full min-h-screen bg-[#fdfdfd]">
      {/* nav */}
      <div className="lg:flex w-full">
        <div className="shrink-0 py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-24 bg-[#fdfdfd]">
        <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="flex flex-col">
            {NavItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.to === "" ? "/userDashboard" : `/userDashboard/${item.to}`}
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
          </ul>
        </nav>
      </div>
      <div className="lg:py-26 px-2 md:px-16 lg:px-4 w-full">
        <Outlet/>
      </div>
      </div>
    </div>
  );
};

export default UserDashboard;
