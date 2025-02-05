import { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { MonthlyStat } from "../../types/monthlyStat";

interface TableCMProps {
  items: MonthlyStat[];
}

const TableCM = ({ items }: TableCMProps) => {
  const [selectedRow, setSelectedRow] = useState<MonthlyStat | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleRowClick = (stat: MonthlyStat) => {
    setSelectedRow(stat);
    onOpen(); 
  };
  
  return (
    <div>
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>date</Th>
            <Th>cm id</Th>
            <Th>babies born</Th>
            <Th>enrolled in school</Th>
            <Th>earned degree</Th>
            <Th>earned drivers license</Th>
            <Th>reunified with children</Th>
            <Th>womens birthdays</Th>
            <Th>childrens birthdays</Th>
            <Th>birthday gift card values</Th>
            <Th>food card values</Th>
            <Th>bus passes</Th>
            <Th>gas cards value</Th>
            <Th>phone contacts</Th>
            <Th>inperson contacts</Th>
            <Th>email contacts</Th>
            <Th>interviews scheduled</Th>
            <Th>interviews conducted</Th>
            <Th>positive tests</Th>
            <Th>no call no shows</Th>
            <Th>other</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item: MonthlyStat, index: number) => (
            <Tr key={index}
            onClick={() => handleRowClick(item)}
            cursor="pointer"
            >
              <Td>{item.id}</Td>
              <Td>{item.date}</Td>
              <Td>{item.cmId}</Td>
              <Td>{item.babiesBorn}</Td>
              <Td>{item.enrolledInSchool}</Td>
              <Td>{item.earnedDegree}</Td>
              <Td>{item.earnedDriversLicense}</Td>
              <Td>{item.reunifiedWithChildren}</Td>
              <Td>{item.womensBirthdays}</Td>
              <Td>{item.childrensBirthdays}</Td>
              <Td>{item.birthdayGiftCardValues}</Td>
              <Td>{item.foodCardValues}</Td>
              <Td>{item.busPasses}</Td>
              <Td>{item.gasCardsValue}</Td>
              <Td>{item.phoneContacts}</Td>
              <Td>{item.inpersonContacts}</Td>
              <Td>{item.emailContacts}</Td>
              <Td>{item.interviewsScheduled}</Td>
              <Td>{item.interviewsConducted}</Td>
              <Td>{item.positiveTests}</Td>
              <Td>{item.noCallNoShows}</Td>
              <Td>{item.other}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Monthly Stats Details</ModalHeader>
      <ModalBody>
        {selectedRow && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Question</Th>
                <Th>Answer</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>ID</Td>
                <Td>{selectedRow.id}</Td>
              </Tr>
              <Tr>
                <Td>Date</Td>
                <Td>{selectedRow.date}</Td>
              </Tr>
              <Tr>
                <Td>CM ID</Td>
                <Td>{selectedRow.cmId}</Td>
              </Tr>
              <Tr>
                <Td>Babies Born</Td>
                <Td>{selectedRow.babiesBorn}</Td>
              </Tr>
              <Tr>
                <Td>Enrolled in School</Td>
                <Td>{selectedRow.enrolledInSchool}</Td>
              </Tr>
              <Tr>
                <Td>Earned Degree</Td>
                <Td>{selectedRow.earnedDegree}</Td>
              </Tr>
              <Tr>
                <Td>Earned Drivers License</Td>
                <Td>{selectedRow.earnedDriversLicense}</Td>
              </Tr>
              <Tr>
                <Td>Reunified With Children</Td>
                <Td>{selectedRow.reunifiedWithChildren}</Td>
              </Tr>
              <Tr>
                <Td>Womens Birthdays</Td>
                <Td>{selectedRow.womensBirthdays}</Td>
              </Tr>
              <Tr>
                <Td>Childrens Birthdays</Td>
                <Td>{selectedRow.childrensBirthdays}</Td>
              </Tr>
              <Tr>
                <Td>Birthday Gift Card Value</Td>
                <Td>{selectedRow.birthdayGiftCardValues}</Td>
              </Tr>
              <Tr>
                <Td>Food Card Values</Td>
                <Td>{selectedRow.foodCardValues}</Td>
              </Tr>
              <Tr>
                <Td>Bus Passes</Td>
                <Td>{selectedRow.busPasses}</Td>
              </Tr>
              <Tr>
                <Td>Gas Cards Values</Td>
                <Td>{selectedRow.gasCardsValue}</Td>
              </Tr>
              <Tr>
                <Td>Phone Contacts</Td>
                <Td>{selectedRow.phoneContacts}</Td>
              </Tr>
              <Tr>
                <Td>Inperson Contacts</Td>
                <Td>{selectedRow.inpersonContacts}</Td>
              </Tr>
              <Tr>
                <Td>Email Contacts</Td>
                <Td>{selectedRow.emailContacts}</Td>
              </Tr>
              <Tr>
                <Td>Interviews Scheduled</Td>
                <Td>{selectedRow.interviewsScheduled}</Td>
              </Tr>
              <Tr>
                <Td>Interviews Conducted</Td>
                <Td>{selectedRow.interviewsConducted}</Td>
              </Tr>
              <Tr>
                <Td>Positive Tests</Td>
                <Td>{selectedRow.positiveTests}</Td>
              </Tr>
              <Tr>
                <Td>No Call No Shows</Td>
                <Td>{selectedRow.noCallNoShows}</Td>
              </Tr>
              <Tr>
                <Td>Other</Td>
                <Td>{selectedRow.other}</Td>
              </Tr>
            </Tbody>
        </Table>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  </div>
  );
};

export default TableCM;
