import React from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputProps,
} from "@chakra-ui/react";

interface CQInputProps extends InputProps {
  leftIcon?: React.ReactNode; // Icon to display on the left
  rightIcon?: React.ReactNode; // Icon to display on the right
}

const CQInput: React.FC<CQInputProps> = ({ leftIcon, rightIcon, ...props }) => {
  return (
    <InputGroup>
      {leftIcon && <InputLeftElement>{leftIcon}</InputLeftElement>}
      <Input
        focusBorderColor="teal.400"
        borderRadius="md"
        bg="white"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "gray.50" }}
        {...props}
      />
      {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
    </InputGroup>
  );
};

export default CQInput;
