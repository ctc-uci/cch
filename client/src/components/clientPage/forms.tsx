import {
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
        <TableContainer>
            <Table variant="simple">
                <Thead>
                <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {forms.map((form) => (
                        <Tr key={form.type}>
                            <Td>{form.date ? form.date : ""}</Td>
                            <Td>{form.type}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
};
export default Forms;
