import React from 'react';
import Container from '../../../shared/components/container/Container';

const Sidebar: React.FC = () => {

     return (
         <Container 
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeIn',
                    exitAnimation: 'animate__fadeOut',
                    isEntering: true,
                },
            }} 
            TwClassName='flex-col bg-black text-white p-4 flex-2'
        >
            sidebar
         </Container>
     );
};
export default Sidebar;
