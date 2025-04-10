import { ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { FormsProps } from "./types";

function Forms({ forms }: FormsProps) {
  return (
    <Box
      mb="2vh"
      p={2}
      overflow="hidden"
    >
      <TableContainer
        sx={{
          overflowX: "auto",
          overflowY: "auto",
          maxWidth: "50%",
          border: "1px solid gray",
          borderRadius: "md",
        }}
      >
        <Table variant="simple">
          <Thead
            backgroundColor="white"
            position="sticky"
            top={0}
          >
            <Tr>
              <Th
                fontSize="md"
                color="black"
                width="40%"
              >
                Date
              </Th>
              <Th
                fontSize="md"
                color="black"
                width="40%"
              >
                Title
              </Th>
              <Th
                fontSize="md"
                color="black"
                width="20%"
                textAlign="center"
              >
                Export
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr key={form.title}>
                <Td fontSize="sm">
                  {new Date(form.date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })}
                </Td>
                <Td fontSize="sm">{form.title || form.type}</Td>
                <Td
                  fontSize="sm"
                  textAlign="center"
                >
                  <ArrowUpIcon
                    boxSize={5}
                    cursor="pointer"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Forms;
