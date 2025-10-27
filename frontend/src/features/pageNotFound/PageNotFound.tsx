import React from 'react';
import Pod from '../../components/pod/Pod';
import src from '../../../public/images/404.png';

const PageNotFound: React.FC = () => {

    return (
        <Pod className='flex flex-row min-h-[calc(100vh-50px)] justify-center items-center'>
            <Pod className='w-full md:w-1/3 mx-auto flex flex-col justify-center items-center'>
                <div className='text-9xl text-primary primary-font font-bold mb-4'>404</div>
                <img src={src} className='w-full mb-4' />
                <div className='text-xl secondary-font font-bold mb-4'>Not all who wander are lost. But you sure are</div>
                <div className='btn btn-primary'>Go Home</div>
            </Pod>
        </Pod>
    );
};
export default PageNotFound;
