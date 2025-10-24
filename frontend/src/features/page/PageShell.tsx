import React from 'react';
import type { PageShellProps } from './pageTypes';
import Footer from '../footer/Footer';

const PageShell: React.FC<PageShellProps> = ({ page }) => {

    return (
        <div className='overflow-scroll hide-sb'>
            {page.pageRenderMethod === 'static' ? (
                <div className='page-body p-4'>{page.pageName}</div>
            ) : (
                <div>dynamic</div>
            )}
            <Footer />
        </div>
    );
};
export default PageShell;
