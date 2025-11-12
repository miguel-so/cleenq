import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Link,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useApi from '../../lib/hooks/useApi';
import useToastNotification from '../../lib/hooks/useToastNotification';
import { ApiCommand } from '../../lib/Api';
import urlConstants from '../../lib/constants/url.constants';
import { Path } from '../../lib/constants/path.constants';

const { forgotPassword: forgotPasswordUrl } = urlConstants.auth;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const showToast = useToastNotification();
  const { loading: isSendCodeLoading, sendRequest: forgotRequest } = useApi();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    forgotRequest({
      command: ApiCommand.POST,
      url: forgotPasswordUrl,
      options: { email },
      callback: (data, error) => {
        if (error) {
          showToast({ title: 'Error', description: error, status: 'error' });
          return;
        }

        showToast({
          title: 'Email Sent',
          description: 'A 6-digit reset code has been sent to your email.',
          status: 'success',
        });
        navigate(`${Path.RESET_PASSWORD}/${email}`)
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
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" width="full" isLoading = {isSendCodeLoading}>
          Send Reset Code
        </Button>

        {/* Back to Login */}
        <HStack pt={4}>
          <Text fontSize="sm">Remembered your password?</Text>
          <Link as={RouterLink} to="/login" color="teal.600" fontWeight="medium">
            Back to Login
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
