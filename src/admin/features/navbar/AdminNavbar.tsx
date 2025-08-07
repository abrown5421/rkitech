import React, { useState, useRef, useEffect } from 'react';
import Container from '../../../shared/components/container/Container';
import Image from '../../../shared/components/image/Image';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getTimeOfDay } from '../../../shared/utils/getTimeOfDay';
import Cookies from 'js-cookie';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import { clearAdminAuthUser } from '../auth/adminAuthUserSlice';
import Loader from '../../../shared/components/loader/Loader';

const AdminNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const authAdminUser = useAppSelector((state) => state.adminAuthUser);
  const tod = getTimeOfDay();
  const greeting = `${tod} ${authAdminUser.user?.firstName || ''}`;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'logoutButton';

  const handleLogout = () => {
    dispatch(setLoading({ loading: true, id: 'logoutButton' }));
    clientNavigation('/', 'Home', '')();
    setTimeout(() => {
      dispatch(setNotLoading());
      Cookies.remove('adminAuthUser');
      dispatch(clearAdminAuthUser());
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Container
      TwClassName="h-[50px] justify-between items-center bg-white p-2 relative z-40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
    >
      <Container
        TwClassName="items-center"
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeInLeft',
            exitAnimation: 'animate__fadeOutLeft',
            isEntering: true,
          },
        }}
      >
        <Image src="../../../public/assets/images/logo.png" height={50} alt="Rkitech" />
        <Text text="Rkitech" TwClassName="text-xl font-primary text-black" />
      </Container>

      <Container
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeInRight',
            exitAnimation: 'animate__fadeOutRight',
            isEntering: true,
          },
        }}
      >
        {authAdminUser?.user && (
          <div className="relative" ref={dropdownRef}>
            <Button TwClassName="p-2" cursor="pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {authAdminUser?.user.profileImage ? (
                <Image
                  src={authAdminUser.user.profileImage}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  TwClassName="rounded-full border border-gray-300 cursor-pointer object-cover"
                />
              ) : (
                <Container TwClassName="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                  <Text
                    TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                    text={`${authAdminUser.user.firstName?.[0] || ''}${authAdminUser.user.lastName?.[0] || ''}`.toUpperCase()}
                  />
                </Container>
              )}
            </Button>

            
            <Container 
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeIn animate__faster',
                        exitAnimation: 'animate__fadeOut animate__faster',
                        isEntering: dropdownOpen,
                    },
                }} 
                TwClassName="absolute flex-col right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-300 z-50 p-4 space-y-4"
                >
                <Text text={greeting} TwClassName="text-lg font-semibold text-gray-700" />
                <Button
                    TwClassName="w-full p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary"
                    cursor="pointer"
                    onClick={handleLogout}
                >
                    {isLoading ? (
                    <Loader variant="spinner" color="bg-white" />
                    ) : (
                    <Text text="Logout" />
                    )}
                </Button>
            </Container>
            
          </div>
        )}
      </Container>
    </Container>
  );
};

export default AdminNavbar;
