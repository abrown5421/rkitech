import React from 'react';
import Pod from '../../components/pod/Pod';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`flex flex-row w-full min-h-[150px] p-4 relative z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.15)] bg-base-300 text-base-content`}>
            <Pod className="flex flex-col flex-8 justify-between">
                <Pod className="flex flex-row flex-1 items-center gap-4">
                    primary
                </Pod>
                <Pod className="flex flex-row flex-1 items-center text-sm">
                    &copy; {currentYear} Rkitech all rights reserved
                    | Auxilary
                </Pod>
            </Pod>
            <Pod className="flex flex-col flex-4 justify-center items-end">
                right side
            </Pod>
            
        </footer>
    );
};
export default Footer;
