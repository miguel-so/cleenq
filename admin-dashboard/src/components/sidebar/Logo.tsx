import { Box, Flex, Image, Text } from '@chakra-ui/react';

interface LogoProps {
  collapse: boolean;
}

export const Logo = ({ collapse }: LogoProps) => (
  <Flex
    w='full'
    alignItems='center'
    justifyContent='space-between'
    flexDirection={collapse ? 'row' : 'column'}
    gap={4}
  >
    <Box display='flex' alignItems='center' gap={2}>
      <Image src="/logo-black-on-white.png" alt="Logo" height="30px" color='black' />
      {collapse && (
        <Text fontWeight='bold' fontSize={16} pl={2}>
          Artwork
        </Text>
      )}
    </Box>
    
  </Flex>
);
