import { Outlet } from 'react-router-dom';

import AdminMainLayout from '../components/layouts/AdminMainLayout';

const PrivateRoute = () => {
  return (
    <AdminMainLayout>
      <Outlet />
    </AdminMainLayout>
  );
};

export default PrivateRoute;
