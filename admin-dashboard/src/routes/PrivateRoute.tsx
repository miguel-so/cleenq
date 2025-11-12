import { Navigate, Outlet } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import AdminMainLayout from "../components/layouts/AdminMainLayout";
import { useAuth } from "../lib/contexts/AuthContext";
import { Path } from "../lib/constants/path.constants";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={Path.LOGIN} replace />;
  }

  return (
    <AdminMainLayout>
      <Outlet />
    </AdminMainLayout>
  );
};

export default PrivateRoute;
