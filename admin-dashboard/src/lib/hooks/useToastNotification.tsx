import { useToast } from '@chakra-ui/react';

const useToastNotification = () => {
  const toast = useToast();

  const showToast = ({
    title,
    description,
    status,
    duration = 5000,
    isClosable = true,
  }: {
    title: string;
    description: string;
    status: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    isClosable?: boolean;
  }) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
    });
  };

  return showToast;
};

export default useToastNotification;
