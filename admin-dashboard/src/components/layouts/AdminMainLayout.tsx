import { PropsWithChildren, useState } from "react";
import { Flex, HStack } from "@chakra-ui/react";

import { Sidebar } from "../sidebar/Sidebar";
import AdminHeader from "../AdminHeader";

const AdminMainLayout = ({ children }: PropsWithChildren) => {
  const [collapse, setCollapse] = useState(true);

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
