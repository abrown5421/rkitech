import React from 'react';
import Pod from '../../components/pod/Pod';
import { useNavigation } from '../../hooks/useNavigate';
import type { IPage } from '../page/pageTypes';
import type { NavbarProps } from './navbarTypes';
import { useAppSelector } from '../../store/hooks';

const Navbar: React.FC<NavbarProps> = ({ configs, loading }) => {
  const navigate = useNavigation();
  const activePage = useAppSelector((state) => state.activePage)
  const navbarConfig = configs.find(c => c.key === 'navbar');

  if (loading || !navbarConfig) {
    return (
      <div className="navbar h-16 px-4 shadow-sm justify-between">
        <div className="flex flex-row items-center space-x-4">
          <div className="w-12 h-12 bg-base-200 rounded animate-pulse" />
          <div className="w-24 h-6 bg-base-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-row items-center space-x-4">
          <div className="w-16 h-6 bg-base-200 rounded animate-pulse" />
          <div className="w-16 h-6 bg-base-200 rounded animate-pulse" />
          <div className="w-16 h-6 bg-base-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <Pod
      animationObject={{
        entranceAnimation: navbarConfig.data.componentAnimation?.entranceAnimation,
        exitAnimation: navbarConfig.data.componentAnimation?.exitAnimation,
        isEntering: true,
      }}
      className={`navbar ${navbarConfig.data.backgroundColor} shadow-sm justify-between h-16 px-4`}
    >
      <Pod
        animationObject={{
          entranceAnimation: navbarConfig.data.logoAnimation?.entranceAnimation,
          exitAnimation: navbarConfig.data.logoAnimation?.exitAnimation,
          isEntering: true,
        }}
        className="flex flex-row items-center"
      >
        <Pod className="flex flex-col">
          <img
            src={navbarConfig.data.logo}
            alt="Logo"
            className="h-full max-h-12 object-contain"
          />
        </Pod>
        <Pod className="flex flex-col justify-center primary-font">
          {navbarConfig.data.logoTitle}
        </Pod>
      </Pod>

      <Pod className="flex flex-row items-center space-x-4">
        {navbarConfig.data.menuItems?.map((item: any) => {
          const isActive =
            item.itemType === 'page' &&
            activePage?.activePageName === item.itemTitle;

          if (item.itemType === 'page') {
            return (
              <span
                key={item.itemId}
                className={`${
                  isActive
                    ? 'text-primary'
                    : 'text-base-content hover:text-primary cursor-pointer'
                } transition-colors duration-200`}
                onClick={() => {
                  if (!isActive) {
                    navigate({
                      pageName: item.itemTitle,
                      pagePath: item.itemPath,
                    } as IPage);
                  }
                }}
              >
                {item.itemTitle}
              </span>
            );
          } else if (item.itemType === 'link') {
            return (
              <a
                key={item.itemId}
                href={item.itemPath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content hover:text-primary cursor-pointer transition-colors duration-200"
              >
                {item.itemTitle}
              </a>
            );
          }

          return null;
        })}
      </Pod>
    </Pod>
  );
};

export default Navbar;
