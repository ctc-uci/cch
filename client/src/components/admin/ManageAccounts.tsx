import { useEffect, useMemo, useState } from "react";
// import { Navbar } from "../Navbar";
import { EditIcon } from "@chakra-ui/icons";
// import  EditClient  from "../userSettings/EditClient";
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
  Textarea,
  Spacer,
  Box,

  Flex,
  IconButton,
  FormControl,
  FormHelperText,
  Input,
  useToast
} from "@chakra-ui/react";
import { Tabs, TabList, Tab } from '@chakra-ui/react'
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import EditSettings from "../userSettings/EditSettings";
import { TriangleDownIcon, TriangleUpIcon, ChevronLeftIcon } from "@chakra-ui/icons";

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

export const ManageAccounts = () => {
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [add, setAdd] = useState<boolean>(true);
  const toast = useToast();

  const [clientModalOpened, setClientModalOpened] = useState(false)
  const [clientModalID, setClientModalID] = useState('')


  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        header: "Name",
        accessorFn: (row) =>
          `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const firstName = row.original.firstName;
          const lastName = row.original.lastName;
          return `${firstName} ${lastName}`;
        },
        sortingFn: (a, b) => {
          const aValue = `${a.original.firstName} ${a.original.lastName}`;
          const bValue = `${b.original.firstName} ${b.original.lastName}`;
          return aValue.localeCompare(bValue);
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "location",
        header: "Site",
      },
      ],
      []
    );

    const table = useReactTable({
      data: data,
      columns,
      state: {
        sorting,
      },
      sortDescFirst: true,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

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
            <br></br>
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
        else if (view === "cms"){
          const response = await backend.get("/admin/caseManagers");
          setData(response.data);
        }
        else{
          const response = await backend.get("/admin/clients");
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const email = data.email;
    const role = view === "admin" ? "admin" : "user";
    try {
      await backend.post("/users/invite", {
        email: email,
        role: role,
      });
      await backend.post("/email", {
        email: email,
        message: "Sign up"
      });
      toast({
        title: `${view === 'admin' ? "Admin" : "Case Manager"} User invited!`,
        description: `Thank you!`,
        status: "success",
      });
    } catch (e) {
      toast({
        title: "An error occurred",
        description: `User was not invited: ${e.message}`,
        status: "error",
      });
    }
  };

  return (
      <HStack alignItems="flex-start" width = "100%" height="100%">
      {add ? (
      <VStack
      justifyContent = "flex-start"
      alignItems = "flex-start"
      width = "60%"
      marginLeft="5%"
      >

      <HStack justifyContent="space-between">
        <VStack
        justifyContent = "flex-start"
        alignItems = "flex-start"
        width = "60%"
        marginLeft="5%"
        >
          <Heading>Manage Acounts</Heading>
          <HStack width="100%">
            <HStack width = "55%" justifyContent="space-between">
              <Tabs>
                <TabList>
                  <Tab onClick={() => setView("admin")}>Admins</Tab>
                  <Tab  onClick={() => setView("cms")}>Case Managers</Tab>
                  <Tab  onClick={() => setView("clients")}>Clients</Tab>
                </TabList>
              </Tabs>

            </HStack>
              
            
         
          </Box>

          </HStack>
          {view !== "clients"  && 
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
            {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      cursor={header.column.getCanSort() ? "pointer" : "default"}
                      onClick={header.column.getToggleSortingHandler()}
                      textAlign="center"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <Box
                          display="inline-block"
                          ml={1}
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <TriangleUpIcon />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <TriangleDownIcon />
                          ) : null}
                        </Box>
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  cursor="pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize="14px"
                      fontWeight="500px"
                      onClick={(e) => {
                        if (cell.column.id === "id") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
          </TableContainer>
          } 
          <Flex wrap='wrap' gap='4'>
            {view === "clients" ? data.map((person, id) => (
              <Box key={id}>
                <Box p={5}
                  borderRadius="md"
                  boxShadow="sm"
                  bg="white"
                  borderColor="gray.100"
                  borderWidth="1px" >
                  <Flex direction={'row'} justify="space-between" gap={'4'}>
                    <Text textColor={'gray'} fontWeight={'bold'}>EMAIL</Text>
                    <Text textColor={'gray'}>{person.email}</Text>
                  </Flex>
                  <Flex direction={'row'} justify="space-between" gap={'4'}>
                    <Text textColor={'gray'} fontWeight={'bold'}>PASSWORD</Text>
                    <Text textColor={'gray'}>{"*******************"}</Text>
                  </Flex>
                </Box>
                <Flex align="center" justify={'center'} textColor={'brand.Blue 500'} gap={2} onClick={() => {
                  setClientModalID(person.email)
                  setClientModalOpened(true)
                }}>
                  <EditIcon />
                  <Text>Edit Profile</Text>
                </Flex>
              </Box>
            )) : <></>}

          </Flex>
          <Modal isOpen={clientModalOpened} onClose={() => setClientModalOpened(false)}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader>Settings</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* <EditClient email={clientModalID} /> */}
              </ModalBody>
            </ModalContent>
          </Modal>

        <Modal isOpen={open} onClose={() => setOpen(!open)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedData ? outputDrawerData(selectedData, view) : null}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={() => setOpen(!open)}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </VStack>
      </HStack>

  );
};
