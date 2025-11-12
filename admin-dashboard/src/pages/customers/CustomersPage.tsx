import { Box, Heading, Text } from "@chakra-ui/react";

import Page from "../../components/common/Page";

const CustomersPage = () => {
  return (
    <Page>
      <Box bg="white" borderRadius="lg" p={6} boxShadow="sm">
        <Heading size="lg" mb={2}>
          Customers
        </Heading>
        <Text color="gray.600">
          Customer management tools are coming soon. In the meantime, you can
          continue managing customers through the API.
        </Text>
      </Box>
    </Page>
  );
};

export default CustomersPage;

