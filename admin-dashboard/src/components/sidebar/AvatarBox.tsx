import {
  Avatar,
  Flex,
  IconButton,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';
import { MdOutlineMoreHoriz } from 'react-icons/md';
import { useAuth } from '../../lib/contexts/AuthContext'; // Assuming you have this context

interface AvatarBoxProps {
  collapse: boolean;
}

export const AvatarBox = ({ collapse }: AvatarBoxProps) => {
  const { user, logout } = useAuth(); // Access user and logout function from AuthContext

  // Handle case where user data might not be available yet (e.g., on initial load)
  if (!user) {
    return null; // or render a loading spinner, etc.
  }

  return (
    <Flex
      borderWidth={collapse ? 1 : 0}
      borderColor='gray.100'
      borderRadius='full'
      w='full'
      p={2}
      alignItems='center'
      justifyContent='space-between'
      gap={2}
      flexDirection={collapse ? 'row' : 'column-reverse'}
    >
      <Avatar
        name={user.username}
        color='white'
        bg='teal.300'
      />

      {collapse && (
        <Flex
          w='full'
          flexDirection='column'
          gap={4}
          justifyContent='center'
          alignItems='flex-start'
        >
          <Text fontSize='sm' fontWeight='bold' pb='0' lineHeight={0}>
            {user.username}
          </Text>
          <Text as='small' color='gray.500' fontSize={11} lineHeight={0}>
            {user.email}
          </Text>
        </Flex>
      )}


      <Popover trigger='hover'>
        <PopoverTrigger>
          <IconButton
            aria-label='Settings'
            icon={<MdOutlineMoreHoriz />}
            borderRadius='full'
            color='gray.400'
            variant='ghost'
            fontSize={20}
          />
        </PopoverTrigger>
        <PopoverContent
          width='auto'
          bg='white'
          boxShadow='md'
          borderRadius='md'
        >
          <PopoverArrow />
          <PopoverBody p={2}>
            <VStack spacing={2} align='start'>
              <Button
                colorScheme='red'
                size='sm'
                onClick={logout} // Call logout function from context
              >
                Logout
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
