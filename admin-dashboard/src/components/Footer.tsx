import { Box, Flex, Link, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg='#1f6463' color='white' p={6}>
        <Flex
          justify='space-between'
          align='center'
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <Text fontSize='sm'>© Copyright 2030 - All Rights Reserved</Text>
          <Flex gap={5}>
            <Link href='#' _hover={{ textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
            <Link href='#' _hover={{ textDecoration: 'underline' }}>
              Terms of Service
            </Link>
            <Link href='#' _hover={{ textDecoration: 'underline' }}>
              Cookies Settings
            </Link>
          </Flex>
        </Flex>
    </Box>
  );
};

export default Footer;