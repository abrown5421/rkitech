import React from 'react';
import Container from '../../shared/components/container/Container';

const Footer: React.FC = () => {

    return (
        <Container
            height={50}
            padding="sm"
            justifyContent="between"
            alignItems="center"
            bgColor="bg-white"
            className="relative z-40 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]"
        >
            Footer
        </Container>
    );
};

export default Footer;
