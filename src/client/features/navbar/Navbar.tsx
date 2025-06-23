import React, { useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import ComponentRenderer from '../componentRenderer/ComponentRenderer';

const Navbar: React.FC = () => {
    const app = useAppSelector((state) => state.initialApp);
    const navbar = app.components.find((components) => components.componentName === 'Navbar')
    useEffect(()=>{console.log(app)}, [app])
    return (
        <>
            {navbar && <ComponentRenderer node={navbar.componentContent} />}
        </>
    );
};

export default Navbar;
