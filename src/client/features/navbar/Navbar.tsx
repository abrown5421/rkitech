import React from 'react';
import type { NavbarProps } from './navbarTypes';
import Text from '../../../components/text/Text';
import { useAppSelector } from '../../../store/hooks';
import { useClientNavigationHook } from '../../hooks/useClientNavigationHook';

const Navbar: React.FC<NavbarProps> = ({ twClasses = [] }) => {
    const useClientNavigation = useClientNavigationHook();
    const app = useAppSelector((state) => state.initialApp);
    const activePage = useAppSelector((state) => state.client.activeClientPage)

    const primaryMenuPages = app.pages
    .filter((page) => page.menuConfigs?.primaryMenu?.show)
    .sort((a, b) => {
      return (
        (a.menuConfigs.primaryMenu.order ?? 0) -
        (b.menuConfigs.primaryMenu.order ?? 0)
      );
    });

    return (
        <div className={`flex flex-row justify-between shadow-md relative z-50 ${twClasses.join(' ')}`}>
        <div>
            <Text twClasses={['text-amber-500', 'font-mono', 'font-bold', 'text-xl']} text="Rkitech" />
        </div>
        <div className="flex space-x-4">
            {primaryMenuPages.map((page) => (
                <div
                    key={page.pageID}
                    role="button"
                    tabIndex={0}
                    onClick={useClientNavigation(page.menuConfigs.pageSlug, page.pageName, page.pageID)}
                    onKeyDown={(e) => e.key === 'Enter' && useClientNavigation(page.menuConfigs.pageSlug, page.pageName, page.pageID)()}
                    className={`font-mono cursor-pointer hover:text-amber-500 ${
                        page.pageName === activePage.activeClientPageName
                        ? 'text-amber-500 font-bold'
                        : 'text-gray-700'
                    }`}
                >
                    {page.pageName}
                </div>
            ))}
        </div>
        </div>
    );
    };

export default Navbar;
