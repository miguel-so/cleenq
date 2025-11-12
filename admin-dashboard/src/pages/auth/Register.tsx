import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  HStack,
  Link,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import useApi from '../../lib/hooks/useApi';
import useToastNotification from '../../lib/hooks/useToastNotification';
import { ApiCommand } from '../../lib/Api';
import urlConstants from '../../lib/constants/url.constants';
import { Path } from '../../lib/constants/path.constants';

const { register: registerUrl } = urlConstants.auth;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
  });

  const navigate = useNavigate();
  const showToast = useToastNotification();
  const { loading: isRegisterLoading, sendRequest: registerRequest } = useApi();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerRequest({
      command: ApiCommand.POST,
      url: registerUrl,
      options: formData,
      callback: (data, error) => {
        if (error) {
          showToast({
            title: 'Registration Failed',
            description: error,
            status: 'error',
          });
          return;
        }

        showToast({
          title: 'Registration Successful',
          description:
            'Please check your email to verify your account before logging in.',
          status: 'success',
        });
        navigate(Path.LOGIN);
      },
    });
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="200px"
      p="8"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input name="username" value={formData.username} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea name="bio" value={formData.bio} onChange={handleChange} />
        </FormControl>

        <Button type="submit" colorScheme="teal" width="full" isLoading={isRegisterLoading}>
          Register
        </Button>

        <HStack pt={4}>
          <Text fontSize="sm">Already have an account?</Text>
          <Link as={RouterLink} to="/login" color="teal.600" fontWeight="medium">
            Back to Login
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Register;
