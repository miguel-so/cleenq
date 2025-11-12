import { Outlet } from 'react-router-dom';

import MainLayout from '../components/layouts/MainLayout';

const UnauthorizedRoute = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default UnauthorizedRoute;
