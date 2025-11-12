import { Link } from 'react-router-dom';
import {
  ListIcon,
  Link as ChakraLink,
  Box,
  Badge,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

interface NavItemProps {
  item: NavbarItem;
  isActive: boolean;
  collapse: boolean;
}

export const NavItem = ({ item, isActive, collapse }: NavItemProps) => {
  const { label, path } = item;
  const { icon, count } = item;

  const isMobile = useBreakpointValue({ base: true, md: false }); // Adjust behavior for mobile view

  return (
    <Box
      display='flex'
      alignItems='center'
      my={6}
      justifyContent='center'
      flexDirection={isMobile && collapse ? 'row' : 'column'} // Adjust layout for mobile and collapsed state
      position='relative' // Positioning context for Badge
    >
      {/* Link with conditional active background */}
      <ChakraLink
        as={Link}
        to={path}
        display='flex'
        alignItems='center'
        gap={3}
        _hover={{
          textDecoration: 'none',
          color: 'teal.500', // Hover icon color change
          // bg: 'teal.50', // Hover background
          transform: 'scale(1.05)', // Slight zoom effect on hover
          transition: 'transform 0.2s, color 0.2s, background-color 0.2s', // Smooth transition
        }}
        fontWeight='medium'
        color={isActive ? 'teal.700' : 'gray.600'}
        w='full'
        justifyContent={collapse ? 'flex-start' : 'center'}
        borderRadius='md' // Rounded corners
        p={2} // Padding for better hit area
        bg={isActive ? 'teal.100' : 'transparent'} // Active background color
        transition='background-color 0.2s' // Smooth transition for background color change
      >
        {/* Icon styling */}
        <ListIcon
          as={icon}
          fontSize={24}
          color={isActive ? 'teal.700' : 'gray.600'}
          marginX={collapse ? '' : 'auto'}
        />

        {/* Text visibility based on collapse */}
        {collapse && (
          <Text fontSize='sm' fontWeight='medium'>
            {label}
          </Text>
        )}
      </ChakraLink>

      {/* Badge visibility and styling */}
      {collapse && count && (
        <Badge
          borderRadius='full'
          colorScheme='yellow'
          w={6}
          h={6}
          textAlign='center'
          fontSize='sm'
          display={collapse ? 'block' : 'none'} // Only show on expanded mode
          position='absolute'
          top={2}
          right={2}
          boxShadow='md'
        >
          {count}
        </Badge>
      )}
    </Box>
  );
};
