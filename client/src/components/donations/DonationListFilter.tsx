import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast,
  Divider,
  IconButton,
} from "@chakra-ui/react";

import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { FaPlus } from "react-icons/fa";
import {
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineFilterAlt,
} from "react-icons/md";

interface DonationListFilterProps {
  setFilterQuery: React.Dispatch<React.SetStateAction<string[]>>;

}


export const DonationListFilter = ({setFilterQuery}: DonationListFilterProps) => {
    const toast = useToast();
    const [nextId, setNextId] = useState(2);

    const columns = [
      { name: "Date", value: "donations.date", type: "date" },
      { name: "Donor", value: "donors.name", type: "string" },
      { name: "Category", value: "donations.category", type: "string" },
      { name: "Value ($)", value: "donations.value", type: "number" },
      { name: "Total ($)", value: "donations.total", type: "number" },
    ];



  const [filterRows, setFilterRows] = useState([
      {
      id: 1,
      selector: "",
      field: "",
      operator: "",
      value: "",
      },
  ]);

  useEffect(() => {
    setFilterQuery([
      "",
      ...filterRows.map((row) => {
        if (row.field !== "" && row.operator !== "" && row.value !== "") {
          if (row.operator === "contains") {
            return `${row.selector} ${row.field} ILIKE '%${row.value}%'`;
          }
          else if (row.operator === "=") {
            return `${row.selector} ${row.field} ILIKE '%${row.value}%'`;
          }
          return `${row.selector} ${row.field} ${row.operator} '${row.value}'`;
        }
        return "";
      })
      .filter((query: string) => query !== ""),
    ]);
  }, [filterRows, setFilterQuery]);

  const addNewRow = () => {
    if (filterRows.length > 0 && filterRows[filterRows.length - 1]?.field === "" || filterRows[filterRows.length - 1]?.value === "" || filterRows[filterRows.length - 1]?.operator === "") {
        toast({
            title: "Incomplete Fields",
            description: "Please fill in all fields before adding a new filter",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        return;
    }
    setFilterRows([
      ...filterRows,
      {
        id: nextId,
        selector: "AND",
        field: "",
        operator: "",
        value: "",
      },
    ]);
    setNextId(nextId + 1);

  };

  const removeRow = (id: number) => {

    if (filterRows.length > 1) {
      setFilterRows((prevRows) => {
        const updatedRows = prevRows.filter(row => row.id !== id);

        if (updatedRows.length === 0) {
            return [
                {
                    id: 1,
                    selector: "",
                    field: "",
                    operator: "",
                    value: "",
                },
            ];
        }

        return updatedRows.map((row, index) => ({
            ...row,
            selector: index === 0 ? "" : row.selector,
        }));
    });

    }
    else {
        setFilterRows([
            {
            id: 1,
            selector: "",
            field: "",
            operator: "",
            value: "",
            },
        ]);
    }
  };

  const updateFilterValue = (id: number, selectType: string, value: string) => {
    setFilterRows(filterRows.map(row => {
      if (row.id === id) {
        return { ...row, [selectType]: value };
      }
      return row;
    }));
  };

  return (
    <Popover placement="right-end">
      <PopoverTrigger>
        <Button>
          <HStack>
            <Icon as={MdOutlineFilterAlt} />
            <h1>Filter</h1>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="auto"
        p={2}
      >
        <PopoverArrow />
        <PopoverBody>
          <VStack
            spacing={4}
            align="stretch"
            w="100%"
          >
            <Text
              fontSize="14px"
              fontWeight="300"
            >
              In this view, show records
            </Text>
            {filterRows.map((row, index) => (
              <Box
                key={row.id}
                width="100%"
                overflow="visible"
              >
                <HStack
                  spacing={0}
                  align="center"
                >
                {index === 0 ? (
                     <Text
                     fontWeight="medium"
                     fontSize="md"
                     marginRight={"47px"}
                   >
                     Where
                   </Text>
                ) : (
                    <Select
                    value={row.selector}
                    marginRight={"14px"}
                    onChange={(e) => updateFilterValue(row.id, 'selector', e.target.value)}
                    maxWidth={"80px"}
                  >
                     <option value="AND">and</option>
                     <option value="OR">or</option>
                  </Select>
                )}


                  <Select
                    placeholder="Select Field"
                    width="150px"
                    value={row.field}
                    onChange={(e) => updateFilterValue(row.id, 'field', e.target.value)}
                    borderRightRadius="0"
                  >
                    {
                        columns.map((column) => {
                            return <option key={column.name} typeof={column.type} value={column.value}>{column.name}</option>
                        })
                    }
                  </Select>

                     {(() => {
                        const selectedColumn = columns.find((col) => col.value === row.field);
                        const fieldType: string = selectedColumn?.type || "string";
                        let operators: { value: string; label: string }[] = [];

                        if (fieldType === "number") {
                          operators = [
                            { value: "=", label: "equals" },
                            { value: "!=", label: "not equals" },
                            { value: ">", label: "greater than" },
                            { value: "<", label: "less than" },
                          ];
                        } else if (fieldType === "date") {
                          operators = [
                            { value: "=", label: "is" },
                            { value: "!=", label: "is not" },
                          ];
                        } else if (fieldType === "string") {
                          operators = [
                            { value: "contains", label: "contains" },
                            { value: "=", label: "equals" },
                          ];
                        }

                        return (
                          <>
                             <Select
                              placeholder="Select Operator"
                              width="150px"
                              value={row.operator}
                              onChange={(e) => updateFilterValue(row.id, 'operator', e.target.value)}
                              borderRadius="0"
                            >
                              {operators.map((op) => (
                                  <option key={op.value} value={op.value}>
                                    {op.label}
                                  </option>
                                ))}
                              </Select>
                              {fieldType === "boolean" ? (
                              <Select
                              width="150px"
                                placeholder="Select Value"
                                value={row.value}
                                onChange={(e) => updateFilterValue(row.id, "value", e.target.value)}
                                borderRadius="0"
                              >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </Select>
                            ) : fieldType === "date" ? (
                              <Input
                                type="date"
                                width="150px"
                                value={row.value}
                                onChange={(e) => updateFilterValue(row.id, "value", e.target.value)}
                                borderRadius="0"
                              />
                            ) : (
                              <Input
                                placeholder="Enter a value"
                                width="150px"
                                value={row.value}
                                onChange={(e) => updateFilterValue(row.id, "value", e.target.value)}
                                borderRadius="0"
                              />
                            )}
                          </>
                        )

                      })()}

                  <Button onClick={() => removeRow(row.id)} variant='outline' borderLeftRadius="0">
                    <Icon
                        as={MdOutlineDelete}
                    />
                  </Button>

                </HStack>
              </Box>
            ))}
            <Button
              leftIcon={<MdOutlineAdd />}
              onClick={addNewRow}
              size="sm"
              variant="ghost"
            >
              Add Filter
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};


type Props = {
  donors: string[];
  donor: string;
  setDonor: (d: string) => void;
  newDonor: string;
  setNewDonor: (n: string) => void;

  addDonor: (name: string) => Promise<void>;
};

export function DonationFilter({
  donors,
  donor,
  setDonor,
  newDonor,
  setNewDonor,
  handleAddDonor,
}: {
  donors: string[];
  donor: string;
  setDonor: (d: string) => void;
  newDonor: string;
  setNewDonor: (n: string) => void;
  handleAddDonor: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState("");
  const filtered = useMemo(
    () =>
      donors.filter((d) =>
        typeof d === "string" &&
          d.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [donors, searchTerm]
  );

  const selectDonor = (d: string) => {
    setDonor(d);
    onClose();
  };

  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={() => {
        onClose();
        onAddClose();
        setSearchTerm("");
      }}
      closeOnBlur
      closeOnSelect={false}
    >
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
        w="300px"
        textAlign="left"
      >
        {donor || "Select Donor"}
      </MenuButton>

      <MenuList w="300px" p={2} boxShadow="md">
        <InputGroup mb={2}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search donor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <VStack align="stretch" spacing={0} maxH="100vh" overflowY="auto">
          {filtered.map((d) => (
            <MenuItem key={d} onClick={() => selectDonor(d)}>
              {d}
            </MenuItem>
          ))}
          {filtered.length === 0 && (
            <Text px={2} color="gray.500" fontSize="sm">
              No donors found
            </Text>
          )}
        </VStack>

        <Divider my={2} />

        {!isAddOpen && (
          <MenuItem
            icon={<FaPlus color="gray" />}
            onClick={onAddOpen}
            color="gray.600"
          >
            Add New Donor
          </MenuItem>
        )}

        {isAddOpen && (
          <HStack px={2} py={1}>
            <Input
              placeholder="New donor name"
              value={newDonor}
              onChange={(e) => setNewDonor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddDonor();
                if (e.key === "Escape") onAddClose();
              }}
            />
            <IconButton
              aria-label="Confirm add donor"
              icon={<FaPlus />}
              size="sm"
              onClick={handleAddDonor}
            />
          </HStack>
        )}
      </MenuList>
    </Menu>
  );
}
