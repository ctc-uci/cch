import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useParams } from "react-router-dom";
import {
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import FormFrontDesk from "./form";

interface MonthlyStats {
  date: string;
  id: number;
  totalOfficeVisits: number;
  totalCalls: number;
  totalUnduplicatedCalles: number;
  totalVisitsToPantryAndDonationsRoom: number;
  totalNumberOfPeopleServedInPantry: number;
  totalVisitsToPlacentiaPantry: number;
  totalNumberOfPeopleServedInPlacentiaPantry: number;
}

export const FrontDeskMonthlyStats = () => {
  const { backend } = useBackendContext();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<MonthlyStats | null>(null);
  const params = useParams<{ id: string }>();

  const fetchFrontDesk = async () => {
    try {
      const response = await backend.get("frontDesk/");
      console.log(response.data);
      setMonthlyStats(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFrontDesk()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleRowClick = (stat: MonthlyStats) => {
    setSelectedRow(stat);
    onOpen(); // Open modal
  };

  return (
    <div>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>ID</Th>
            <Th>Total Office Visits</Th>
            <Th>Total # of Calls</Th>
            <Th>Total # of Unduplicated Calls</Th>
            <Th>Total # of Visits to the HB Pantry/Donations Room</Th>
            <Th>Total # of People Served in the HB Pantry</Th>
            <Th>Total # of Visits to the Placentia Pantry</Th>
            <Th>Total # of People Served in the Placentia Pantry</Th>
          </Tr>
        </Thead>
        <Tbody>
          {monthlyStats.map((stat, index) => (
            <Tr
              key={index}
              onClick={() => handleRowClick(stat)}
              cursor="pointer"
            >
              <Td>{stat.date}</Td>
              <Td>{stat.id}</Td>
              <Td>{stat.totalOfficeVisits}</Td>
              <Td>{stat.totalCalls}</Td>
              <Td>{stat.totalUnduplicatedCalles}</Td>
              <Td>{stat.totalVisitsToPantryAndDonationsRoom}</Td>
              <Td>{stat.totalNumberOfPeopleServedInPantry}</Td>
              <Td>{stat.totalVisitsToPlacentiaPantry}</Td>
              <Td>{stat.totalNumberOfPeopleServedInPlacentiaPantry}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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
                    <Td>Total Office Visits</Td>
                    <Td>{selectedRow.totalOfficeVisits}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total # of Calls</Td>
                    <Td>{selectedRow.totalCalls}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total # of Unduplicated Calls</Td>
                    <Td>{selectedRow.totalUnduplicatedCalles}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total # of Visits to the HB Pantry/Donations Room</Td>
                    <Td>{selectedRow.totalVisitsToPantryAndDonationsRoom}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total # of People Served in the HB Pantry</Td>
                    <Td>{selectedRow.totalNumberOfPeopleServedInPantry}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total # of Visits to the Placentia Pantry</Td>
                    <Td>{selectedRow.totalVisitsToPlacentiaPantry}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total # of People Served in the Placentia Pantry</Td>
                    <Td>{selectedRow.totalNumberOfPeopleServedInPlacentiaPantry}</Td>
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
      <FormFrontDesk />
    </div>
  );
};