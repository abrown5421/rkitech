import React from 'react';
import Container from '../../shared/components/container/Container';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

const Modal: React.FC = () => {
    const modal = useSelector((state) => state.modal);

     return (
         <div>
            {modal.isOpen && (
                <Container 
                    width='w-full'
                    height='h-full'
                    justifyContent='center'
                    alignItems='center'
                    className={clsx('bg-gray-950/60 absolute top-0', modal.isOpen && 'z-40')}
                    animation={{
                        entranceExit: {
                        entranceAnimation: 'animate__fadeIn',
                        exitAnimation: 'animate__fadeOut',
                        isEntering: modal.isOpen,
                        },
                    }}
                >
                    <Container 
                        width='w-1/3'
                        height='h-1/2'
                        className={clsx('bg-gray-50 rounded-2xl', modal.isOpen && 'z-50')}
                        animation={{
                        entranceExit: {
                            entranceAnimation: 'animate__backInDown',
                            exitAnimation: 'animate__backOutUp',
                            isEntering: modal.isOpen,
                        },
                        }}
                    >
                        {modal.title}
                    </Container> 
                </Container>
            )}
         </div>
     );
};
export default Modal;
