import React from 'react';
import logo from '../../../public/images/Logo.png';

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm justify-between h-16 px-4">
      <a className="btn btn-ghost text-xl no-animation">
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <img
              src={logo}
              alt="Logo"
              className="h-full max-h-12 object-contain" 
            />
          </div>
          <div className="flex flex-col justify-center primary-font">Reactor</div>
        </div>
      </a>
      <div className="flex flex-row items-center">
        menu
      </div>
    </div>
  );
};

export default Navbar;
