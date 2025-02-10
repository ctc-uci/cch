import { useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  VStack,
  useToast 
} from "@chakra-ui/react";

import {
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineFilterAlt,
} from "react-icons/md";

interface ClientListFilterProps {
  setFilterQuery: React.Dispatch<React.SetStateAction<string[]>>;
}


export const ClientListFilter = ({setFilterQuery}: ClientListFilterProps) => {
    const toast = useToast();
    const [nextId, setNextId] = useState(2);

    const columns = [
      { name: "Client First Name", value: "clients.first_name", type: "string" },
      { name: "Client Last Name", value: "clients.last_name", type: "string" },
      { name: "Date of Birth", value: "clients.date_of_birth", type: "date" },
      { name: "Case Manager First Name", value: "case_managers.first_name", type: "string" },
      { name: "Case Manager Last Name", value: "case_managers.last_name", type: "string" },
      { name: "Location", value: "locations.name", type: "string" },
      { name: "Unit ID", value: "clients.unit_id", type: "number" },
      { name: "Grant", value: "clients.grant", type: "string" },
      { name: "Status", value: "clients.status", type: "string" },
      { name: "Age", value: "clients.age", type: "number" },
      { name: "Phone Number", value: "clients.phone_number", type: "string" },
      { name: "Email", value: "clients.email", type: "string" },
      { name: "Emergency Contact Name", value: "clients.emergency_contact_name", type: "string" },
      { name: "Emergency Contact Phone", value: "clients.emergency_contact_phone_number", type: "string" },
      { name: "Medical", value: "clients.medical", type: "boolean" },
      { name: "Entrance Date", value: "clients.entrance_date", type: "date" },
      { name: "Estimated Exit Date", value: "clients.estimated_exit_date", type: "date" },
      { name: "Exit Date", value: "clients.exit_date", type: "date" },
      { name: "Bed Nights", value: "clients.bed_nights", type: "number" },
      { name: "Bed Nights for Children", value: "clients.bed_nights_children", type: "number" },
      { name: "Pregnant Upon Entry", value: "clients.pregnant_upon_entry", type: "boolean" },
      { name: "Disabled Children", value: "clients.disabled_children", type: "boolean" },
      { name: "Ethnicity", value: "clients.ethnicity", type: "string" },
      { name: "Race", value: "clients.race", type: "string" },
      { name: "City of Last Permanent Residence", value: "clients.city_of_last_permanent_residence", type: "string" },
      { name: "Prior Living", value: "clients.prior_living", type: "string" },
      { name: "Prior Living City", value: "clients.prior_living_city", type: "string" },
      { name: "Shelter in Last 5 Years", value: "clients.shelter_in_last_five_years", type: "boolean" },
      { name: "Homelessness Length", value: "clients.homelessness_length", type: "number" },
      { name: "Chronically Homeless", value: "clients.chronically_homeless", type: "boolean" },
      { name: "Attending School Upon Entry", value: "clients.attending_school_upon_entry", type: "boolean" },
      { name: "Employment Gained", value: "clients.employement_gained", type: "boolean" },
      { name: "Reason for Leaving", value: "clients.reason_for_leaving", type: "string" },
      { name: "Specific Reason for Leaving", value: "clients.specific_reason_for_leaving", type: "string" },
      { name: "Specific Destination", value: "clients.specific_destination", type: "string" },
      { name: "Savings Amount", value: "clients.savings_amount", type: "number" },
      { name: "Attending School Upon Exit", value: "clients.attending_school_upon_exit", type: "boolean" },
      { name: "Reunified", value: "clients.reunified", type: "boolean" },
      { name: "Successful Completion", value: "clients.successful_completion", type: "boolean" },
      { name: "Destination City", value: "clients.destination_city", type: "string" },
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
  }, [filterRows]);

  const addNewRow = () => {
    if (filterRows.length > 0 && filterRows[filterRows.length - 1]?.field === "" || filterRows[filterRows.length - 1]?.value === "" || filterRows[filterRows.length - 1]?.operator === "") {
        toast({
            title: "Incomplete Fields",
            description: "Please fill in all fields before adding a new filter",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          console.log(filterRows[filterRows.length - 1]);
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
    <Popover placement="bottom-start">
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
                        } else if (fieldType === "boolean" || fieldType === "date") {
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
