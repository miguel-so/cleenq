import { Box, Heading, Text } from "@chakra-ui/react";

import Page from "../../components/common/Page";

const CleanersPage = () => {
  return (
    <Page>
      <Box bg="white" borderRadius="lg" p={6} boxShadow="sm">
        <Heading size="lg" mb={2}>
          Cleaners
        </Heading>
        <Text color="gray.600">
          Cleaner scheduling and assignment features will appear here soon. Stay
          tuned!
        </Text>
      </Box>
    </Page>
  );
};

export default CleanersPage;

