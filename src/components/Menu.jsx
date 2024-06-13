import React, { useState, useEffect } from 'react';
import { CiLogout } from "react-icons/ci";
import { GrPlan  } from "react-icons/gr";
import { MdOutlinePayment } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { Link } from 'react-router-dom';

import Logo from "../images/lojiper_yazilim_logo.png";

function Menu() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { 
        setIsMenuCollapsed(true);
      } else {
        setIsMenuCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`flex flex-col fixed top-0 left-0 h-full w-${isMenuCollapsed ? '16' : '48'} bg-gray-900 text-white transition-all duration-300`}>
      <div className="flex items-center justify-center h-20 bg-gray-900">
        <img src={Logo} alt="Lojiper Yazılım Logo" className="h-16" />
      </div>
      <div className="flex flex-col items-start justify-start flex-grow mt-8">
        {isMenuCollapsed ? (
          <>
            <Link to="/">
              <MenuItem icon={<AiOutlineDashboard className="h-6 w-6" />} />
            </Link>
            <Link to="/debts">
              <MenuItem icon={<MdOutlinePayment className="h-6 w-6" />} />
            </Link>
            <Link to="/payment-plan">
              <MenuItem icon={<GrPlan className="h-6 w-6" />} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">
              <MenuItem icon={<AiOutlineDashboard className="h-6 w-6" />} label="Gösterge Paneli" />
            </Link>
            <Link to="/debts">
              <MenuItem icon={<MdOutlinePayment className="h-6 w-6" />} label="Borçlar" />
            </Link>
            <Link to="/payment-plan">
              <MenuItem icon={<GrPlan className="h-6 w-6" />} label="Ödeme Planı" />
            </Link>
          </>
        )}
      </div>
      
      <div className="flex items-center cursor-pointer hover:text-blue-300 ml-4 mt-auto mb-4">
        <Link to="/logout" className="flex items-center">
          <CiLogout className="h-6 w-6 mr-2" />
        </Link>
      </div>


      <div className="text-gray-500 text-sm mt-auto mb-4 ml-4">© 2024 Lojiper Yazılım</div>
    </div>
  );
}

const MenuItem = ({ icon, label }) => (
  <div className="flex items-center my-5 cursor-pointer hover:text-blue-300 ml-4">
    {icon}
    <span className="ml-2">{label}</span>
  </div>
);

export default Menu;
