import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useAuth } from "../../lib/contexts/AuthContext";
import urlConstants from "../../lib/constants/url.constants";
import useApi from "../../lib/hooks/useApi";
import useToastNotification from "../../lib/hooks/useToastNotification";
import { ApiCommand } from "../../lib/Api";
import { Path } from "../../lib/constants/path.constants";

const { login: loginUrl } = urlConstants.auth;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const showToast = useToastNotification();

  const { sendRequest: loginRequest } = useApi<LoginResponse>();

  // if (isAuthenticated) navigate('/');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    loginRequest({
      callback: (data: LoginResponse | null, error: string | null) => {
        if (error) {
          showToast({
            title: "Login Failed",
            description: data?.message || error,
            status: "error",
          });
          return;
        }
        if (!data) return null;
        const { token } = data.data;
        const { email, username } = data.data.user;
        localStorage.setItem("cq_auth_token", token);
        login({
          token,
          user: {
            email,
            username,
          },
        });
        navigate(Path.DASHBOARD);
      },
      command: ApiCommand.POST,
      url: loginUrl,
      options: {
        email: formData.email,
        password: formData.password,
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
      <VStack spacing={4} as="form" onSubmit={handleLogin}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
        </FormControl>

        <Button colorScheme="teal" width="full" type="submit">
          Login
        </Button>
        <VStack spacing={2} pt={4}>
          <HStack spacing={2}>
            <Text fontSize="sm">Don't have an account?</Text>
            <Link
              as={RouterLink}
              to="/register"
              color="teal.600"
              fontWeight="medium"
            >
              Register
            </Link>
          </HStack>

          <Link
            as={RouterLink}
            to="/forgot-password"
            color="teal.500"
            fontSize="sm"
            _hover={{ textDecoration: "underline" }}
          >
            Forgot your password?
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Login;
