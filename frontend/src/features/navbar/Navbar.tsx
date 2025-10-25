import React from 'react';
import logo from '../../../public/images/Logo.png';
import Pod from '../../components/pod/Pod';

const Navbar: React.FC = () => {
  return (
    <Pod animationObject={{
      entranceAnimation: 'animate__fadeIn',
      exitAnimation: 'animate__fadeOut',
      isEntering: true
    }} 
    className="navbar bg-base-100 shadow-sm justify-between h-16 px-4">
        <Pod 
          animationObject={{
            entranceAnimation: 'animate__fadeInLeft',
            exitAnimation: 'animate__fadeOutLeft',
            isEntering: true
          }} 
          className="flex flex-row items-center"
        >
          <Pod className="flex flex-col">
            <img
              src={logo}
              alt="Logo"
              className="h-full max-h-12 object-contain" 
            />
          </Pod>
          <Pod className="flex flex-col justify-center primary-font">Rkitech</Pod>
        </Pod>
      
      <Pod 
        animationObject={{
          entranceAnimation: 'animate__fadeInRight',
          exitAnimation: 'animate__fadeOutRight',
          isEntering: true
        }}
        className="flex flex-row items-center"
      >
        menu
      </Pod>
    </Pod>
  );
};

export default Navbar;
