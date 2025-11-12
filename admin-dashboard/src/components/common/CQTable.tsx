import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";

interface Column {
  key: string; // Unique key for the column (used to map data)
  label: string; // Display name for the column
  render?: (value: any, row: any) => React.ReactNode; // Custom render for cell content
}

interface CustomTableProps {
  columns: Column[]; // Array of columns for table headers
  data: any[]; // Array of row data
  loading: boolean; // Loading state
  actions?: (row: any) => React.ReactNode; // Function to render action buttons
}

const CQTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  loading,
  actions,
}) => {
  return (
    <Box
      overflowX="auto"
      height="full"
      borderWidth="1px"
      borderRadius="md"
      padding={4}
    >
      <Table variant="simple">
        <Thead height="50px">
          <Tr>
            {columns.map((col) => (
              <Th
                key={col.key}
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                position="sticky"
                top="0"
                zIndex="1"
              >
                {col.label}
              </Th>
            ))}
            {actions && (
              <Th
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                position="sticky"
                top="0"
                zIndex="1"
              >
                Actions
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td
                colSpan={columns.length + (actions ? 1 : 0)}
                textAlign="center"
                py={4}
              >
                Loading...
              </Td>
            </Tr>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <Tr key={row.id || rowIndex} _hover={{ bg: "gray.100" }}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </Td>
                ))}
                {actions && <Td>{actions(row)}</Td>}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td
                colSpan={columns.length + (actions ? 1 : 0)}
                textAlign="center"
                py={4}
              >
                No data found
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CQTable;
