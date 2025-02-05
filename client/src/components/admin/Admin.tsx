import { useEffect, useState } from "react";
import { Navbar } from "../Navbar";

import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Td,
  Tr,
  Text,
  Button,
  Heading,
  HStack,
  VStack, 
  Textarea
} from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react"

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const Admin = () => {
  // const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [data, setData] = useState([]);
  const [view, setView] = useState("admin"); // "admin" | "cms" | "clients"
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [clientData, setClientData] = useState([]);

  const roles_dict = {
    "admin": "Administrator",
    "cms": "Case Manager",
    "clients": "Client"
  }

  const handleRowClick = (datum) => {
    setSelectedData(datum);
    setOpen(true);
  };

  const getLocationFromCM = (id) => {
    let match = "Cannot get location";
    for (let i = 0; i < locationData.length; i++) {
      if (locationData[i].cmId === id) {
        match = locationData[i].name;
        break;
      }
    }
    return match;
  }

  const getCMClients = (id) => {
    const matches = [];
    for (let i = 0; i < clientData.length; i++) {
      if (clientData[i].createdBy === id) {
        matches.push(clientData[i].firstName + " " + clientData[i].lastName);
      }
    }
    return matches;
  }

  const outputDrawerData = (data) => {
    switch (view) {
      case "admin":
        return (
          <>
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Administrator</Text>
            <br></br>
            <Text>Notes</Text>
            <Textarea size="md"/>
          </>
        );
      case "cms":
        
        return (
          <>
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Case Manager</Text>
            <Text>{getLocationFromCM(data.id)}</Text>
            <br></br>
            <Text>Notes</Text>
            <Textarea size="md"/>
            <br></br>
            <Text>Case Manager's Clients</Text>
            <Text>{getCMClients(data.id).length} Clients</Text>
            <>{getCMClients(data.id) ? getCMClients(data.id).map((datum, index) => (
              <Text key = {index}>{index + 1}. {datum}</Text>
              )): 
            null}
            </>
          </>
        );
      case "clients":
        return (
          <>
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Client</Text>
            <br></br>
            <Text>Notes</Text>
            <Textarea size="md"/>
          </>
        );
      default:
        return <></>;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loc_response = await backend.get("/locations");
        setLocationData(loc_response.data);
        const client_response = await backend.get("/clients");
        setClientData(client_response.data);
      } catch (error) {
        console.log("Error fetching client data: ", error);
      }
    }
    fetchData();
  }, [backend])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (view === "admin") {
          const response = await backend.get("/caseManagers");
          const adminData = response.data.filter((user: { role: string; }) => user.role === "admin" || user.role === "superadmin");
          setData(adminData);
        }
        else if (view === "clients") {
          setData(clientData);
        }
        else {
          const response = await backend.get("/caseManagers");
          const cmData = response.data.filter((user: { role: string; }) => user.role === "case manager");
          setData(cmData);
        }
      } catch (error) {
        console.log("Error fetching client data: ", error);
      }
    };
    fetchData();  
  }, [view, backend, clientData]);

  return (
    <>
      <Navbar/>
      <HStack justifyContent="space-between">
        <VStack
        justifyContent = "flex-start" 
        alignItems = "flex-start"
        width = "60%" 
        marginLeft="5%"
        >
          <Heading>Manage Acounts</Heading>
          <HStack width = "55%" justifyContent="space-between">
            <Button onClick={() => setView("admin")}>Admins</Button>
            <Button onClick={() => setView("cms")}>Case Managers</Button>
            <Button onClick={() => setView("clients")}>Clients</Button>
          </HStack>
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
                <Th>Name</Th>
                <Th>Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data
                ? data.map((datum) => (
                    <Tr key={datum.id} onClick={() => handleRowClick(datum)}>
                      <Td>{datum.firstName} {datum.lastName}</Td>
                      <Td>{datum.email}</Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
        <Button>+ Add New {roles_dict[view]}</Button>
        {/* <Button colorScheme="brand" onClick={() => setOpen(!open)}>
          Open
        </Button> */}
        <Drawer
          isOpen={open}
          placement="right"
          onClose={() => setOpen(!open)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>
            <DrawerBody>
              {selectedData ? outputDrawerData(selectedData, view): null}
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={() => setOpen(!open)}>
                Cancel
              </Button>
              <Button colorScheme="brand">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        </VStack>
      </HStack>
    </>
  );
};
