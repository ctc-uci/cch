import { useEffect, useMemo, useState } from "react";
// import { Navbar } from "../Navbar";
import { EditIcon } from "@chakra-ui/icons";
import  EditClient  from "../userSettings/EditClient";
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
  Slide,
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
  useDisclosure,
} from '@chakra-ui/react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
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
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal
  } = useDisclosure();
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
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [editEmailDrawerOpened, setEditEmailDrawerOpened] = useState(false);
  const [clientModalOpened, setClientModalOpened] = useState(false)
  const [clientModalID, setClientModalID] = useState('')
  const [email, setEmail] = useState("");


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
    setEditDrawerOpened(true);

  };
  
  const emailDrawer = (data: Person, view: string) => {
    const handleSubmitEmailChange = async (e) => {
      e.preventDefault(); 
      try {
        console.log(data.id);
        await backend.put(`/caseManagers/${data.id}`, {
          role: null,
          firstName: null,
          lastName: null,
          phoneNumber: null,
          email: email,
        });
        data.email= email;
        setEditEmailDrawerOpened(false);
      } catch (error) {
        console.error(error);
      }
    };
        return (
        <>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Changes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <HStack
                width="100%"
                >
                  <Text
                    margin="20px"
                    mr="40px"
                  >
                    EMAIL
                  </Text>
                  <VStack
                    width="100%"
                    alignItems="flex-start"
                  >
                    <Text>
                      {data.email}
                    </Text>
                  </VStack>
                </HStack>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="space-between" width="100%">
            <Button onClick={closeModal} width="45%">
              Back
            </Button>
            <Button colorScheme="blue" width="45%" onClick={(e) => {closeModal(); handleSubmitEmailChange(e)}}>
              Submit
            </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
        </Modal>
        <Slide
          direction="right"
          in={editEmailDrawerOpened}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 10}}
        >
          <Box
            position="absolute"
            width="100%"
            height="100%"
            bg="white"
            boxShadow="md"
            p={4}
          >
            <IconButton
              aria-label="Back"
              icon={<ChevronLeftIcon />}
              color="black"
              variant="ghost"
              _hover={{
                background: "transparent",
                color: "inherit"
              }}
              width="24px"
              height="24px"
              flex-shrink="0"
              onClick={() => {setEditEmailDrawerOpened(false); setEmail(data.email)}}
            />
            <VStack
            align="flex-start" 
            position="relative" 
            margin="40px"
            >
              <VStack
              borderRadius="12px"
              border="1px solid"
              borderColor="gray.200"
              width="100%"
              align="flex-start" 
              padding="30px"
              >
                <Text>About</Text>
                <HStack
                width="100%"
                >
                  <Text
                    margin="20px"
                    mr="40px"
                  >
                    EMAIL
                  </Text>
                  <VStack
                    width="100%"
                    alignItems="flex-start"
                  >
                    <Text
                    width="100%"
                    textAlign="left"
                    >
                      Email
                    </Text>
                    <Input
                    width="80%"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ></Input>
                  </VStack>
                </HStack>
              </VStack>
                  
            </VStack>
            <Flex width="100%" justifyContent="flex-end">
              <Button colorScheme="blue" onClick={openModal}>Confirm Changes</Button>
            </Flex>
            
          </Box>
        </Slide>
        </>
        );
  }
  const outputDrawerData = (data : Person, view : string) => {
    switch (view) {
      case "admin":
        return (
          <>
            <HStack 
                spacing={8}
                display="flex"
                width="100%"
                padding="20px"
                align="center"
                gap="8px"
                borderRadius="12px"
                border="1px solid var(--gray-200, #E2E8F0)"
                backgroundColor="var(--white, #FFF)"    
              >
                <VStack align="flex-start" width="150px" color="#2D3748"
                  fontSize="14px"
                  fontWeight="700"
                  lineHeight="20px">
                  <Text>NAME</Text>
                  <Text>EMAIL</Text>
                  <Text>ROLE</Text>
                  <Text>LOCATION</Text>
                </VStack>
                <VStack align="flex-start" color="#2D3748"
                  fontSize="14px"
                  fontWeight="400"
                  lineHeight="20px">
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Administrator</Text>
            <Text>{data.location}</Text>
            </VStack>
              </HStack>
              <Flex 
                height="24px"
                px="8px"
                align="center"
                gap="6px"
                justify="center"
                color="#3182CE"
                width="100%"
                margin="16px"
                >
                <Button
                color="var(--blue-500, #3182CE)"
                variant="ghost"
                _hover={{
                  background: "transparent",
                  color: "inherit"
                }}
                onClick={() => {setEditEmailDrawerOpened(true); setEmail(data.email);}}
                >
                  <EditIcon/>
                  <Text   
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="16px">
                    Edit Admin Email
                  </Text>
                </Button>
                
              </Flex>
              <br></br>
              <Text>Notes</Text>
              <Textarea size="md"/>
            <br></br>
          </>
        );
      case "cms":

        return (
          <>
             <HStack 
                spacing={8}
                display="flex"
                width="100%"
                padding="20px"
                align="center"
                gap="8px"
                borderRadius="12px"
                border="1px solid var(--gray-200, #E2E8F0)"
                backgroundColor="var(--white, #FFF)"    
              >
                <VStack align="flex-start" width="150px" color="#2D3748"
                  fontSize="14px"
                  fontWeight="700"
                  lineHeight="20px">
                  <Text>NAME</Text>
                  <Text>EMAIL</Text>
                  <Text>ROLE</Text>
                  <Text>LOCATION</Text>
                </VStack>
                <VStack align="flex-start" color="#2D3748"
                  fontSize="14px"
                  fontWeight="400"
                  lineHeight="20px">
            <Text>{data.firstName} {data.lastName}</Text>
            <Text>{data.email}</Text>
            <Text>Administrator</Text>
            <Text>{data.location}</Text>
            </VStack>
              </HStack>
              <Flex 
                height="24px"
                px="8px"
                align="center"
                gap="6px"
                justify="center"
                color="#3182CE"
                width="100%"
                margin="16px"
                >
                <Button
                color="var(--blue-500, #3182CE)"
                variant="ghost"
                _hover={{
                  background: "transparent",
                  color: "inherit"
                }}
                onClick={() => {setEditEmailDrawerOpened(true); setEmail(data.email);}}
                >
                  <EditIcon/>
                  <Text   
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="600"
                    lineHeight="16px">
                    Edit Case Manager Email
                  </Text>
                </Button>
                
              </Flex>
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
          console.log(response);
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
  }, [view, backend, open, selectedData, editEmailDrawerOpened]);

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

    <HStack justifyContent="space-between" height="100%">
      <VStack
      justifyContent = "flex-start"
      alignItems = "flex-start"
      width = "100%"
      marginLeft="5%"
      height="100%"
      overflowX="hidden"
      >
        <HStack width="100%" overflow="hidden">
          <HStack width = "100%" justifyContent="space-between" display="inline-flex" align-items="flex-start">
            <Tabs>
              <TabList>
                <Tab onClick={() => { setView("admin"); setEditDrawerOpened(false); setEditEmailDrawerOpened(false);}}>Admins</Tab>
                <Tab  onClick={() => { setView("cms"); setEditDrawerOpened(false); setEditEmailDrawerOpened(false);}}>Case Managers</Tab>
                <Tab  onClick={() => { setView("clients"); setEditDrawerOpened(false); setEditEmailDrawerOpened(false);}}>Clients</Tab>
              </TabList>
            </Tabs>
          </HStack>
          <Spacer/>
          <Button position="relative" right="14px">Delete</Button>
          <Button colorScheme="blue" position="relative" right="0">Add</Button>

        </HStack>
        {view !== "clients"  &&
        <TableContainer
        width = "100%"
        height="100%"
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          position: "relative"
        }}
      >
        <Slide
          direction="right"
          in={editDrawerOpened}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 10}}
        >
          <Box
            position="absolute"
            width="100%"
            height="100%"
            bg="white"
            boxShadow="md"
            p={4}
          >
            <IconButton
              aria-label="Back"
              icon={<ChevronLeftIcon />}
              color="black"
              backgroundColor="white"
              variant="ghost"
              _hover={{
                background: "transparent",
                color: "inherit"
              }}
              width="24px"
              height="24px"
              flex-shrink="0"
              onClick={() => setEditDrawerOpened(false)}
            />
            <VStack
            align="flex-start" 
            margin="76px"
            maxWidth="400px"  
            >
              <Text>
                Last Updated:
              </Text>
                  {selectedData ? outputDrawerData(selectedData, view) : null}
            </VStack>
            
          </Box>
          </Slide>
          {emailDrawer(selectedData, view)}
        <Table>
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
              <EditClient email={clientModalID} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </HStack>
  );
};
