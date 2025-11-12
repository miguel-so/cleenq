import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../../lib/hooks/useApi';
import { ApiCommand } from '../../lib/Api';
import urlConstants from '../../lib/constants/url.constants';
import useToastNotification from '../../lib/hooks/useToastNotification';

const { verifyEmail: verifyEmailUrl } = urlConstants.auth;

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { sendRequest: verifyRequest } = useApi();
  const showToast = useToastNotification();

  useEffect(() => {
    if (!token) return;

    verifyRequest({
      command: ApiCommand.GET,
      url: verifyEmailUrl(token),
      callback: (data, error) => {
        setLoading(false);
        if (error) {
          setMessage('Verification failed. Invalid or expired token.');
          showToast({ title: 'Verification Failed', description: error, status: 'error' });
          return;
        }

        setMessage('Your email has been verified successfully!');
        showToast({ title: 'Success', description: 'Email verified!', status: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      },
    });
  }, [token]);

  return (
    <Box textAlign="center" mt="200px">
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack>
          <Text fontSize="lg" color="teal.600">
            {message}
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default VerifyEmail;
