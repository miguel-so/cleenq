import { PropsWithChildren, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex, HStack, Spinner } from "@chakra-ui/react";

import { Sidebar } from "../sidebar/Sidebar";
import { useAuth } from "../../lib/contexts/AuthContext";
import AdminHeader from "../AdminHeader";

const AdminMainLayout = ({ children }: PropsWithChildren) => {
  const [collapse, setCollapse] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  // if (!isAuthenticated) {
  //   return <Navigate to='/login' />;
  // }

  return (
    <HStack w="full" h="100vh" bg="gray.100" gap={0}>
      <Flex
        as="aside"
        w={collapse ? "350px" : "75px"}
        h="full"
        bg="white"
        alignItems="start"
        padding={4}
        flexDirection="column"
        justifyContent="space-between"
        transition="max-width 0.3s ease"
        borderRight="1px solid grey"
        borderStyle="dashed"
      >
        <Sidebar collapse={collapse} />
      </Flex>
      <Flex flexDirection="column" width="full" h="100vh">
        <AdminHeader onCollapse={() => setCollapse(!collapse)} />
        <Flex as="main" w="full" h="full" flexDirection="column">
          {children}
        </Flex>
      </Flex>
    </HStack>
  );
};

export default AdminMainLayout;
