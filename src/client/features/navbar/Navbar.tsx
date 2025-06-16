import React from 'react';
import type { NavbarProps } from './navbarTypes';

const Navbar: React.FC<NavbarProps> = ({ twClasses = [] }) => {

     return (
         <div className={`flex flex-row justify-between shadow-md ${twClasses.join(' ')}`}>
            <div>logo section</div>
            <div>menu section</div>
         </div>
     );
};
export default Navbar;
