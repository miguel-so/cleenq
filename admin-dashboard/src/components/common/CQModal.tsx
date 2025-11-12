import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
} from "@chakra-ui/react";

interface CQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  body: React.ReactNode;
  footerActions?: React.ReactNode;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
  size?: string;
}

const CQModal: React.FC<CQModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footerActions,
  isSubmitDisabled = false,
  isLoading = false,
  size = "lg",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay bg="whiteAlpha.700" />
      <ModalContent
        borderRadius="lg"
        boxShadow="xl"
        bg="white"
        color="gray.800"
      >
        <ModalHeader
          bgGradient="linear(to-r, teal.200, blue.200)"
          color="gray.800"
          fontSize="lg"
          fontWeight="bold"
          px={6}
          py={4}
          borderTopRadius="lg"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton color="gray.600" _hover={{ bg: "gray.200" }} />
        <ModalBody px={6} py={4} bg="gray.50">
          <Box>{body}</Box>
        </ModalBody>
        <ModalFooter bg="gray.100">
          {footerActions || (
            <>
              <Button
                variant="ghost"
                onClick={onClose}
                colorScheme="gray"
                _hover={{ bg: "gray.200" }}
              >
                Close
              </Button>
              <Button
                ml={3}
                colorScheme="teal"
                _hover={{ bg: "teal.300" }}
                onClick={onSubmit}
                isDisabled={isSubmitDisabled}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CQModal;
