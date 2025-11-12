import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import type { IEmployees } from '../features/employees/employeesTypes';
import { setAdminUser } from '../features/admin/features/adminAuth/adminAuthSlice';

export const useAdminAuthFromCookie = (): boolean => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get('adminUser');
    if (userCookie) {
      try {
        const user: IEmployees = JSON.parse(userCookie);
        dispatch(setAdminUser(user));
      } catch (err) {
        console.error('Failed to parse admin user cookie', err);
      }
    }
    setLoading(false);
  }, [dispatch]);

  return loading;
};