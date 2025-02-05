import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

// import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CaseManager } from "../caseManager/CaseManager";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  entranceDate: string;
  exitDate: string;
  dateOfBirth: string;
}

interface Unit {
    id: string;
    locationId: string;
    name: string;
    type: string;
  }

  interface Location {
    id: string;
    cmId: string;
    name: string;
    date: string;
    caloptimaFunded: string;
  }

  interface CaseManager {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  }

export const ClientData = () => {
//   const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [clients, setClients] = useState<Client[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [caseManagers, setClientManagers] = useState<CaseManager[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await backend.get("/clients");
        setClients(clientResponse.data);
        const unitResponse = await backend.get("/units")
        setUnits(unitResponse.data);
        const locationResponse = await backend.get("/locations")
        setLocations(locationResponse.data);
        const cmResponse = await backend.get("/caseManagers")
        setClientManagers(cmResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend]);

  const getUnit = (unitId: string) => {
    console.log(units);
    if (!units.length) return "Loading unit..."; // Handle case when units are not yet loaded
    const unit = units.find((unit) => unit.id === unitId);
    return unit ? unit : "Unknown unit type";
  };

  const getCaseManager = (cmId: string) => {
    console.log(caseManagers);
    if (!caseManagers.length) return "Loading unit..."; // Handle case when units are not yet loaded
    const cm = caseManagers.find((caseManager) => caseManager.id === cmId);
    return cm ? (cm.firstName + " " + cm.lastName) : "Unknown Case Manager";
  };

  const getLocation = (locationId: string) => {
    console.log(locations);
    if (!locations.length) return "Loading unit..."; // Handle case when units are not yet loaded
    const location = locations.find((location) => location.id === locationId);
    return location ? location.name : "Unknown location";
  };

//   const navigate = useNavigate();

  return (
    <VStack
      spacing = {2}
      align = "start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <Heading paddingBottom = "10px">Client Data</Heading>
      <Heading size = "md" paddingBottom="40px">Last Updated: {}</Heading>
      <TableContainer
        width = "100%"
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          border: "1px solid gray"
        }}
      >
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Unit Type</Th>
              <Th>Family Size</Th>
              {/* <Th>Occupied</Th> */}
              <Th>Case manager</Th>
              <Th>Site</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients
              ? clients.map((client) => (
                //   <Tr key={client.id} onClick={() => navigate(``)} style={{ cursor: "pointer" }}>
                  <Tr key={client.id}>
                    <Td>{client.firstName}</Td>
                    <Td>{client.lastName}</Td>
                    <Td>{getUnit(client.unitId).type }</Td>
                    <Td>{client.bedNightsChildren + 1}</Td>
                    <Td>{getCaseManager(client.createdBy)}</Td>
                    <Td>{getLocation(getUnit(client.unitId).locationId)}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
