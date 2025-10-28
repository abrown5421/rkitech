import React from 'react';
import Pod from '../../components/pod/Pod';
import { useNavigation } from '../../hooks/useNavigate';
import { useAppSelector } from '../../store/hooks';
import type { IPage } from '../page/pageTypes';
import { useGetConfigByKeyQuery } from '../configurations/configurationsApi';

const Footer: React.FC = () => {
  const navigate = useNavigation();
  const activePage = useAppSelector((state) => state.activePage);
  const { data: footerConfig, isLoading } = useGetConfigByKeyQuery('footer');
  const currentYear = new Date().getFullYear();

  if (isLoading || !footerConfig) {
    return (
      <footer className="flex flex-row w-full min-h-[150px] p-4 bg-base-300 text-base-content justify-between items-center">
        <div className="w-24 h-4 bg-base-200 rounded animate-pulse" />
        <div className="w-48 h-4 bg-base-200 rounded animate-pulse" />
      </footer>
    );
  }

  const { copyText, backgroundColor, menuItems = [], auxMenuItems = [] } = footerConfig.data;

  const renderMenuItem = (item: any, index: number) => {
    const isActive = item.itemType === 'page' && activePage?.activePageName === item.itemTitle;

    if (item.itemType === 'page') {
      return (
        <Pod
          key={item.itemId}
          animationObject={{
            entranceAnimation: item.itemAnimation?.entranceAnimation,
            exitAnimation: item.itemAnimation?.exitAnimation,
            isEntering: true,
            delay: 0.1 * index,
          }}
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
        </Pod>
      );
    }

    if (item.itemType === 'link') {
      return (
        <Pod
          key={item.itemId}
          animationObject={{
            entranceAnimation: item.itemAnimation?.entranceAnimation,
            exitAnimation: item.itemAnimation?.exitAnimation,
            isEntering: true,
            delay: 0.1 * index,
          }}
        >
          <a
            href={item.itemPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-content hover:text-primary transition-colors duration-200"
          >
            {item.itemTitle}
          </a>
        </Pod>
      );
    }

    return null;
  };

  return (
    <footer
      className={`flex flex-row flex-wrap w-full min-h-[150px] p-6 relative z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.15)] ${backgroundColor} text-base-content justify-between items-center`}
    >
      <Pod className="flex flex-col flex-1 justify-between">
        <Pod className="flex flex-row flex-wrap gap-6 mb-3">
          {menuItems.map(renderMenuItem)}
        </Pod>

        <Pod className="flex flex-row items-center text-sm mt-3">
            &copy; {currentYear} {copyText}

            {auxMenuItems.length > 0 && (
                <>
                    <Pod className="mx-2">|</Pod>
                    {auxMenuItems.map((item: any, index: number) => (
                        <React.Fragment key={item.itemId}>
                        {renderMenuItem(item, index)}
                        {index < auxMenuItems.length - 1 && <Pod className="mx-2">|</Pod>}
                        </React.Fragment>
                    ))}
                </>
            )}
            </Pod>
      </Pod>

      <Pod className="flex flex-col items-end text-sm mt-4 md:mt-0">
        <span className="opacity-70">Powered by Rkitech</span>
      </Pod>
    </footer>
  );
};

export default Footer;
