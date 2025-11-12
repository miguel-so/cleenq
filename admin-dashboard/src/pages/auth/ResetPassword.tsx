import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../lib/hooks/useApi';
import useToastNotification from '../../lib/hooks/useToastNotification';
import { ApiCommand } from '../../lib/Api';
import urlConstants from '../../lib/constants/url.constants';

const { resetPassword: resetPasswordUrl } = urlConstants.auth;

const ResetPassword = () => {
  const { email: paramEmail } = useParams();
  const [formData, setFormData] = useState({
    email: paramEmail,
    code: '',
    password: '',
  });
  const navigate = useNavigate();
  const showToast = useToastNotification();
  const { sendRequest: resetRequest } = useApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    resetRequest({
      command: ApiCommand.PUT,
      url: resetPasswordUrl,
      options: formData,
      callback: (data, error) => {
        if (error) {
          showToast({ title: 'Error', description: error, status: 'error' });
          return;
        }

        showToast({
          title: 'Password Reset Successful',
          description: 'You can now log in with your new password.',
          status: 'success',
        });
        navigate('/login');
      },
    });
  };

  return (
    <Box
      maxW='400px'
      mx='auto'
      mt='200px'
      p='8'
      borderRadius='lg'
      boxShadow='lg'
      bg='white'
    >
      <VStack spacing={4} as='form' onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input name='email' value={formData.email} disabled />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Reset Code</FormLabel>
          <Input name='code' value={formData.code} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </FormControl>

        <Button type='submit' colorScheme='teal' width='full'>
          Reset Password
        </Button>
      </VStack>
    </Box>
  );
};

export default ResetPassword;
