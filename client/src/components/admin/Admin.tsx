import { useEffect, useState } from "react";
// import { Navbar } from "../Navbar";

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

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  type: string;
  email: string;
}

const roles_dict = {
  "admin": "Administrator",
  "cms": "Case Manager",
  "clients": "Client"
}

type RoleKey = keyof typeof roles_dict;

export const Admin = () => {
  const { backend } = useBackendContext();

  const [data, setData] = useState<Person[]>([]);
  const [view, setView] = useState<RoleKey>("admin"); // "admin" | "cms" | "clients"
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Person>({
    id: "",
    firstName: "",
    lastName: "",
    location: "",
    type: "",
    email: "",
  });
  const [clientData, setClientData] = useState<Person[]>([]);

  const handleRowClick = (datum : Person) => {
    setSelectedData(datum);
    setOpen(true);
  };

  const outputDrawerData = (data : Person, view : string) => {
    switch (view) {
      case "admin":
        return (
          <>
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Administrator</Text>
            <Text>{data.location}</Text>
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
            <Text>{data.location}</Text>
            <br></br>
            <Text>Notes</Text>
            <Textarea size="md"/>
            <br></br>
            <Text>Case Manager's Clients</Text>
            <Text>{clientData.length} Clients</Text>
            <>
              {clientData.length > 0 
                ? clientData.map((datum, index) => (
                    <Text key={index}>{index + 1}. {datum.firstName} {datum.lastName}</Text>
                  ))
                : null}
            </>
          </>
        );
      case "clients":
        return (
          <>
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Client</Text>
            <Text>{data.location}</Text>
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
        if (view === "admin") {
          const response = await backend.get("/admin/admins");
          setData(response.data);
        }
        else if (view === "clients") {
          const response = await backend.get("/admin/clients");
          setData(response.data);
        }
        else {
          const response = await backend.get("/admin/caseManagers");
          setData(response.data);
        }
        if (open && view === "cms") {
          const response = await backend.get(`/admin/${selectedData.id}`);
          setClientData(response.data);
        }
      } catch (error) {
        console.error("Error fetching client data: ", error);
      }
    };
    fetchData();  
  }, [view, backend, open, selectedData]);

  return (
    <>
      {/* <Navbar/> */}
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
                <Th>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data
                ? data.map((datum, index) => (
                    <Tr key={index} onClick={() => handleRowClick(datum)}>
                      <Td>{datum.firstName} {datum.lastName}</Td>
                      <Td>{datum.email}</Td>
                      <Td>{datum.location}</Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
        <Button>+ Add New {roles_dict[view]}</Button>
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
