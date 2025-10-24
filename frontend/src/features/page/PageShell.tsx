import React from 'react';
import type { PageShellProps } from './pageTypes';
import Footer from '../footer/Footer';
import Pod from '../../components/pod/Pod';

const PageShell: React.FC<PageShellProps> = ({ page }) => {

    return (
        <Pod className='overflow-scroll hide-sb'>
            {page.pageRenderMethod === 'static' ? (
                <Pod className='page-body p-4'>{page.pageName}</Pod>
            ) : (
                <Pod>dynamic</Pod>
            )}
            <Footer />
        </Pod>
    );
};
export default PageShell;
