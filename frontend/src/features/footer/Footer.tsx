import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`flex flex-row w-full min-h-[150px] p-4 relative z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.15)] bg-base-300 text-base-content`}>
            <div className="flex flex-col flex-8 justify-between">
                <div className="flex flex-row flex-1 items-center gap-4">
                    primary
                </div>
                <div className="flex flex-row flex-1 items-center text-sm">
                    &copy; {currentYear} Rkitech all rights reserved
                    | Auxilary
                </div>
            </div>
            <div className="flex flex-col flex-4 justify-center items-end">
                right side
            </div>
            
        </footer>
    );
};
export default Footer;
