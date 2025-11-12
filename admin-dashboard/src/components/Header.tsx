import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { Path } from "../lib/constants/path.constants";

const Links = [
  { name: "Home", path: Path.HOME },
  { name: "About Us", path: Path.ABOUT },
  { name: "Arts", path: Path.ARTS },
];

const NavLink = ({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) => {
  const navigate = useNavigate();
  return (
    <Button
      px={3}
      py={2}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: "green.600",
      }}
      onClick={() => navigate(path)}
      fontWeight="bold"
      color="white"
      bg="transparent"
    >
      {children}
    </Button>
  );
};

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg="#1f6463"
      px={6}
      py={3}
      position="fixed"
      top="0"
      width="100%"
      zIndex="999"
      boxShadow="md"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Image src="/logo.png" alt="Logo" height="50px" />

        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="transparent"
          _hover={{ bg: "green.600" }}
        />

        <HStack spacing={8} alignItems={"center"} display={{ base: "none", md: "flex" }}>
          {Links.map((link) => (
            <NavLink key={link.name} path={link.path}>
              {link.name}
            </NavLink>
          ))}
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name} path={link.path}>
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Header;
