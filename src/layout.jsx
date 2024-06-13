// Layout.jsx

import React from 'react';
import Menu from '../src/components/Menu';
const Layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-1/6"> {/* Menü için sabit genişlik  oluşturuldu!*/}
        <Menu />
      </div>
      <div className="w-5/5 p-3"> {/* Diğer içerik için esnek genişlik oluşturuldu! */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
