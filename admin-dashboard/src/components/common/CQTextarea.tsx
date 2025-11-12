import React from "react";
import { Textarea, TextareaProps } from "@chakra-ui/react";

interface CQTextareaProps extends TextareaProps {}

const CQTextarea: React.FC<CQTextareaProps> = (props) => {
  return (
    <Textarea
      focusBorderColor="teal.400"
      borderRadius="md"
      bg="white"
      _placeholder={{ color: "gray.500" }}
      _hover={{ bg: "gray.50" }}
      {...props}
    />
  );
};

export default CQTextarea;
