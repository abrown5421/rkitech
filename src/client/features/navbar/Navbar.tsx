import React, { useEffect } from 'react';
import type { NavbarProps } from './navbarTypes';
import Text from '../../../components/text/Text';
import { useAppSelector } from '../../../store/hooks';

const Navbar: React.FC<NavbarProps> = ({ twClasses = [] }) => {
    const app = useAppSelector((state) => state.initialApp);
    const activePage = useAppSelector((state) => state.client.activeClientPage)

    useEffect(()=>{console.log(activePage)}, [activePage])

    const primaryMenuPages = app.pages
    .filter((page) => page.menuConfigs?.primaryMenu?.show)
    .sort((a, b) => {
      return (
        (a.menuConfigs.primaryMenu.order ?? 0) -
        (b.menuConfigs.primaryMenu.order ?? 0)
      );
    });

    return (
        <div className={`flex flex-row justify-between shadow-md ${twClasses.join(' ')}`}>
        <div>
            <Text twClasses={['text-amber-500', 'font-mono', 'font-bold', 'text-xl']} text="Rkitech" />
        </div>
        <div className="flex space-x-4">
            {primaryMenuPages.map((page) => (
            <a
                key={page.pageID}
                href={page.menuConfigs.pageSlug}
                className={`font-mono hover:text-amber-500 ${
                    page.pageName === activePage.activeClientPageName
                    ? 'text-amber-500 font-bold'
                    : 'text-gray-700'
                }`}
                >
                {page.pageName}
                </a>
            ))}
        </div>
        </div>
    );
    };

export default Navbar;
