import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

interface PageProps {
  children: ReactNode;
}

const Page = ({ children }: PageProps) => {
  return (
    <Flex
      flexDirection='column'
      w='full'
      h='full'
      p={4}
      mt={2}
    >
      {children}
    </Flex>
  );
};

export default Page;
