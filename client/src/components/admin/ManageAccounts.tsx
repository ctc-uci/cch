import { useEffect, useMemo, useState } from "react";

import { EditIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Tab,
  Table,
  TableContainer,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MdFileUpload, MdOutlineManageSearch } from "react-icons/md";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { downloadCSV } from "../../utils/downloadCSV.ts";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox.tsx";
import EditClient from "../userSettings/EditClient";
import AddPreview from "./AddPreview.tsx";
import { DeleteUserModal } from "./DeleteUserModal.tsx";
import { UserInfoSlide } from "./UserInfoSlide.tsx";

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  location: string;
  phoneNumber: string;
  email: string;
  notes: string;
}

const roles_dict = {
  admin: "Administrator",
  cms: "Case Manager",
  clients: "Client",
};

export type RoleKey = keyof typeof roles_dict;

export const ManageAccounts = () => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const currentUserEmail = currentUser?.email ?? null;

  const [persons, setPersons] = useState<
    (Person & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const [view, setView] = useState<RoleKey>("admin"); // "admin" | "cms" | "clients"
  const [selectedData, setSelectedData] = useState<Person>({
    id: -1,
    firstName: "",
    lastName: "",
    location: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const [editDrawerOpened, setEditDrawerOpened] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [checkboxMode, setCheckboxMode] = useState<
    "hidden" | "visible-unchecked" | "visible-checked"
  >("hidden");
  const toast = useToast();

  const buttonStyle = {
    variant: "ghost",
  };

  const [clientModalOpened, setClientModalOpened] = useState(false);
  const [clientModalID, setClientModalID] = useState("");

  const userTypeName = {
    admin: "Admin",
    cms: "Case Manager",
    clients: "Client",
  };

  const title = userTypeName[view];

  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAllCheckboxClick = () => {
    if (checkboxMode === "hidden") {
      // State 1 -> State 2: Show checkboxes and select all
      setCheckboxMode("visible-checked");
      const allIds = persons.map((person) => person.id);
      setSelectedRowIds(allIds);
    } else if (checkboxMode === "visible-checked") {
      // State 2 -> State 3: Keep checkboxes visible but uncheck all
      setCheckboxMode("visible-unchecked");
      setSelectedRowIds([]);
    } else {
      // State 3 -> State 1: Hide checkboxes
      setCheckboxMode("hidden");
      setSelectedRowIds([]);
    }
  };

  const handleUserAdded = (newUser: Person) => {
    setPersons((prev) => [
      ...prev,
      { ...newUser, isChecked: false, isHovered: false },
    ]);
  };

  const handleDelete = async () => {
    try {
      selectedRowIds.map(async (row_id) => {
        const caseManager = await backend.delete(`/caseManagers/${row_id}`);
        await backend.delete(`/users/email/${caseManager.data[0].email}`);
      });
      setPersons(
        persons.filter((client) => !selectedRowIds.includes(client.id))
      );
      setSelectedRowIds([]);

      toast({
        title: `${title}(s) Deleted`,
        description: `Successfully Removed!`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting clients", error);

      toast({
        title: `${title}(s) Not Deleted`,
        description: `An error occurred and ${title.toLowerCase()}(s) was not deleted.`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const onPressCSVButton = () => {
    const selectedPersons = persons.filter((person) =>
      selectedRowIds.includes(person.id)
    );

    const headers = ["First Name", "Last Name", "Phone Number", "E-mail"];

    const data = selectedPersons.map((person) => ({
      "First Name": person.firstName,
      "Last Name": person.lastName,
      "Phone Number": person.phoneNumber,
      "E-mail": person.email,
    }));

    downloadCSV(headers, data, `clients.csv`);
  };

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "rowNumber",
        header: () => {
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={checkboxMode === "visible-checked"}
                isIndeterminate={checkboxMode === "visible-unchecked"}
                onChange={handleSelectAllCheckboxClick}
              />
            </Box>
          );
        },
        enableSorting: false,
      },
      {
        header: "Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
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
      {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ getValue }) => {
          const notes = getValue() as string;
          const maxLength = 20; // Maximum characters to show before truncation

          if (!notes || notes.length === 0) {
            return (
              <Text
                color="gray.400"
                fontStyle="italic"
              >
                No notes
              </Text>
            );
          }

          const truncatedNotes =
            notes.length > maxLength
              ? `${notes.substring(0, maxLength)}...`
              : notes;

          return (
            <Tooltip
              label={notes}
              placement="top"
              hasArrow
              maxW="400px"
              whiteSpace="pre-wrap"
            >
              <Text
                maxW="200px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                _hover={{ color: "blue.500" }}
              >
                {truncatedNotes}
              </Text>
            </Tooltip>
          );
        },
      },
    ],
    [selectedRowIds, persons, handleSelectAllCheckboxClick, checkboxMode]
  );

  const table = useReactTable({
    data: persons,
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (datum: Person) => {
    setSelectedData(datum);
    setEditDrawerOpened(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (view === "admin") {
          const response = await backend.get("/admin/admins");
          setPersons(
            (response.data || []).filter(
              (person: Person) => person.email !== currentUserEmail
            )
          );
        } else if (view === "cms") {
          const response = await backend.get("/admin/caseManagers");
          setPersons(
            (response.data || []).filter(
              (person: Person) => person.email !== currentUserEmail
            )
          );
        } else {
          const response = await backend.get("/admin/clients");
          setPersons(
            (response.data || []).filter(
              (person: Person) => person.email !== currentUserEmail
            )
          );
        }
      } catch (error) {
        console.error("Error fetching client data: ", error);
      }
    };
    fetchData();
  }, [view, backend, setPersons, currentUserEmail]);

  return (
    <VStack
      justifyContent="flex-start"
      alignItems="flex-start"
      marginLeft="5%"
      marginRight="5%"
      height="100%"
      overflowX="hidden"
    >
      <HStack
        width="100%"
        overflow="hidden"
      >
        <HStack
          width="55%"
          justifyContent="space-between"
          display="inline-flex"
          align-items="flex-start"
        >
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  setView("admin");
                  setEditDrawerOpened(false);
                  setSelectedRowIds([]);
                  setCheckboxMode("hidden");
                }}
              >
                Admins
              </Tab>
              <Tab
                onClick={() => {
                  setView("cms");
                  setEditDrawerOpened(false);
                  setSelectedRowIds([]);
                  setCheckboxMode("hidden");
                }}
              >
                Case Managers
              </Tab>
              <Tab
                onClick={() => {
                  setView("clients");
                  setEditDrawerOpened(false);
                  setSelectedRowIds([]);
                  setCheckboxMode("hidden");
                }}
              >
                Clients
              </Tab>
            </TabList>
          </Tabs>
        </HStack>
        <Spacer />
        {view !== "clients" && (
          <>
            <Button
              onClick={deleteOnOpen}
              disabled={selectedRowIds.length === 0}
              colorScheme={selectedRowIds.length === 0 ? "gray" : "red"}
              opacity={selectedRowIds.length === 0 ? 0.5 : 1}
            >
              Delete ({selectedRowIds.length})
            </Button>
            <Button
              colorScheme="blue"
              onClick={onOpen}
            >
              Add
            </Button>
          </>
        )}
      </HStack>
      {view !== "clients" && !editDrawerOpened && (
        <VStack
          align="start"
          spacing="24px"
          paddingTop="24px"
          width="100%"
        >
          <Box
            borderWidth="1px"
            borderRadius="10px"
            width="100%"
          >
            <HStack
              width="100%"
              justify="right"
              paddingLeft="16px"
              paddingTop="8px"
              paddingRight="16px"
              paddingBottom="8px"
            >
              <HStack>
                <IconButton
                  {...buttonStyle}
                  icon={<MdOutlineManageSearch />}
                  aria-label={"search"}
                />
                <Button
                  {...buttonStyle}
                  leftIcon={<MdFileUpload />}
                  onClick={() => onPressCSVButton()}
                  isDisabled={selectedRowIds.length === 0}
                >
                  Export
                </Button>
              </HStack>
            </HStack>
            <TableContainer
              width="100%"
              height="100%"
            >
              <Table>
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          cursor={
                            header.column.getCanSort() ? "pointer" : "default"
                          }
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
                  {table.getRowModel().rows.map((row, index) => (
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
                            if (cell.column.id === "rowNumber") {
                              e.stopPropagation();
                            }
                          }}
                        >
                          {cell.column.id === "rowNumber" ? (
                            <HoverCheckbox
                              id={row.original.id}
                              isSelected={selectedRowIds.includes(
                                row.original.id
                              )}
                              onSelectionChange={handleRowSelect}
                              index={index}
                              alwaysVisible={checkboxMode !== "hidden"}
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <DeleteUserModal
            isOpen={deleteIsOpen}
            onClose={deleteOnClose}
            title={title}
            onSubmit={handleDelete}
          />
        </VStack>
      )}
      {view !== "clients" && editDrawerOpened && (
        <UserInfoSlide
          user={selectedData}
          userType={view}
          onClose={() => {
            setEditDrawerOpened(false);
          }}
        />
      )}
      <Flex
        wrap="wrap"
        gap="4"
        width="100%"
      >
        {view === "clients" && !clientModalOpened ? (
          persons.map((person, id) => (
            <Box key={id}>
              <Box
                p={5}
                borderRadius="md"
                boxShadow="sm"
                bg="white"
                borderColor="gray.100"
                borderWidth="1px"
              >
                <Flex
                  direction={"row"}
                  justify="space-between"
                  gap={"4"}
                >
                  <Text
                    textColor={"gray"}
                    fontWeight={"bold"}
                  >
                    EMAIL
                  </Text>
                  <Text textColor={"gray"}>{person.email}</Text>
                </Flex>
                <Flex
                  direction={"row"}
                  justify="space-between"
                  gap={"4"}
                >
                  <Text
                    textColor={"gray"}
                    fontWeight={"bold"}
                  >
                    PASSWORD
                  </Text>
                  <Text textColor={"gray"}>{"*******************"}</Text>
                </Flex>
              </Box>
              <Flex
                align="center"
                justify={"center"}
                textColor={"brand.Blue 500"}
                gap={2}
                onClick={() => {
                  setClientModalID(person.email);
                  setClientModalOpened(true);
                }}
              >
                <EditIcon />
                <Text>Edit Profile</Text>
              </Flex>
            </Box>
          ))
        ) : (
          <></>
        )}
        {view === "clients" && clientModalOpened ? (
          <EditClient
            email={clientModalID}
            setClientModal={setClientModalOpened}
          />
        ) : (
          <></>
        )}
      </Flex>

      <AddPreview
        userType={view}
        isOpen={isOpen}
        onClose={onClose}
        onUserAdded={handleUserAdded}
      />
    </VStack>
  );
};
