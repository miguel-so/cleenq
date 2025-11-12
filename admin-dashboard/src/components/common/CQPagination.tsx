import React from "react";
import {
  Flex,
  Button,
  Box,
  Select,
  IconButton,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const CQPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <Text key="start-ellipsis" fontSize="sm" color="gray.500" mx={2}>
          ...
        </Text>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          size="sm"
          colorScheme={i === currentPage ? "teal" : "gray"}
          variant={i === currentPage ? "solid" : "outline"}
          borderRadius="full"
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <Text key="end-ellipsis" fontSize="sm" color="gray.500" mx={2}>
          ...
        </Text>
      );
    }

    return pageNumbers;
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      mt={4}
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
      flexWrap="wrap"
      gap={4}
    >
      <Flex alignItems="center" gap={6}>
        <IconButton
          aria-label="Previous Page"
          icon={<ChevronLeftIcon />}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          colorScheme="teal"
          size="sm"
          borderRadius="full"
        />
        <Flex alignItems="center" gap={2}>
          {renderPageNumbers()}
        </Flex>
        <IconButton
          aria-label="Next Page"
          icon={<ChevronRightIcon />}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          colorScheme="teal"
          size="sm"
          borderRadius="full"
        />
      </Flex>

      <Spacer />

      <Flex alignItems="center" gap={2}>
        <Box as="label" htmlFor="page-size" fontSize="sm" color="gray.600">
          Rows per page:
        </Box>
        <Select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          size="sm"
          borderRadius="full"
          width="100px"
          bg="gray.50"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </Select>
        <Box fontSize="sm" color="gray.600">
          of Total: {totalCount}
        </Box>
      </Flex>
    </Flex>
  );
};

export default CQPagination;
