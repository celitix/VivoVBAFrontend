import Sidebar from './sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from "react";

const Mainlayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
                <div
                    className={`flex-1 transition-all duration-300 overflow-auto p-4 bg-white shadow-inner popf
                                   ${isMobile ? "ml-0" : sidebarOpen ? "ml-0" : "ml-0"}  
                        `}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Mainlayout