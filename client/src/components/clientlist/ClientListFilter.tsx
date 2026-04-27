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
  useToast,
  VStack,
} from "@chakra-ui/react";

import {
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineFilterAlt,
} from "react-icons/md";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface FilterColumn {
  name: string;
  value: string;
  type: string;
}

interface ClientListFilterProps {
  setFilterQuery: React.Dispatch<React.SetStateAction<string[]>>;
}

const QUESTION_TYPE_MAP: Record<string, string> = {
  text: "string",
  textarea: "string",
  number: "number",
  date: "date",
  boolean: "boolean",
  select: "string",
  case_manager_select: "string",
};

// Case manager name columns are derived from the JOIN, not from form_questions
const CASE_MANAGER_COLUMNS: FilterColumn[] = [
  { name: "Case Manager First Name", value: "case_managers.first_name", type: "string" },
  { name: "Case Manager Last Name", value: "case_managers.last_name", type: "string" },
];

export const ClientListFilter = ({ setFilterQuery }: ClientListFilterProps) => {
  const toast = useToast();
  const { backend } = useBackendContext();
  const [nextId, setNextId] = useState(2);
  const [columns, setColumns] = useState<FilterColumn[]>(CASE_MANAGER_COLUMNS);

  useEffect(() => {
    backend.get("/formQuestions/form/5").then((res) => {
      const qs: { fieldKey: string; questionText: string; questionType: string; isVisible: boolean; displayOrder: number }[] =
        Array.isArray(res.data) ? res.data : [];

      const dynamic = qs
        .filter((q) => q.isVisible && q.fieldKey !== "created_by")
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((q) => ({
          name: q.questionText,
          value: `clients.${q.fieldKey}`,
          type: QUESTION_TYPE_MAP[q.questionType] ?? "string",
        }));

      setColumns([...dynamic, ...CASE_MANAGER_COLUMNS]);
    }).catch(() => {
      // keep default case manager columns on error
    });
  }, [backend]);

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
      ...filterRows
        .map((row) => {
          if (row.field !== "" && row.operator !== "" && row.value !== "") {
            if (row.operator === "contains") {
              return `${row.selector} ${row.field} ILIKE '%${row.value}%'`;
            } else if (row.operator === "=") {
              return `${row.selector} ${row.field} = '${row.value}'`;
            }
            return `${row.selector} ${row.field} ${row.operator} '${row.value}'`;
          }
          return "";
        })
        .filter((query: string) => query !== ""),
    ]);
  }, [filterRows]);

  const addNewRow = () => {
    if (
      (filterRows.length > 0 &&
        filterRows[filterRows.length - 1]?.field === "") ||
      filterRows[filterRows.length - 1]?.value === "" ||
      filterRows[filterRows.length - 1]?.operator === ""
    ) {
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
        const updatedRows = prevRows.filter((row) => row.id !== id);

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
    } else {
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
    setFilterRows(
      filterRows.map((row) => {
        if (row.id === id) {
          // Changing the field invalidates the current operator/value since types differ
          if (selectType === "field") {
            return { ...row, field: value, operator: "", value: "" };
          }
          return { ...row, [selectType]: value };
        }
        return row;
      })
    );
  };

  return (
    <Popover placement="right-end">
      <PopoverTrigger>
        <Button background={"white"} variant="ghost" mt={-2}>
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
                      onChange={(e) =>
                        updateFilterValue(row.id, "selector", e.target.value)
                      }
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
                    onChange={(e) =>
                      updateFilterValue(row.id, "field", e.target.value)
                    }
                    borderRightRadius="0"
                  >
                    {columns.map((column) => {
                      return (
                        <option
                          key={column.value}
                          typeof={column.type}
                          value={column.value}
                        >
                          {column.name}
                        </option>
                      );
                    })}
                  </Select>

                  {(() => {
                    const selectedColumn = columns.find(
                      (col) => col.value === row.field
                    );
                    const fieldType: string = selectedColumn?.type || "string";
                    let operators: { value: string; label: string }[] = [];

                    if (fieldType === "number") {
                      operators = [
                        { value: "=", label: "equals" },
                        { value: "!=", label: "not equals" },
                        { value: ">", label: "greater than" },
                        { value: "<", label: "less than" },
                      ];
                    } else if (
                      fieldType === "boolean" ||
                      fieldType === "date"
                    ) {
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
                          onChange={(e) =>
                            updateFilterValue(
                              row.id,
                              "operator",
                              e.target.value
                            )
                          }
                          borderRadius="0"
                        >
                          {operators.map((op) => (
                            <option
                              key={op.value}
                              value={op.value}
                            >
                              {op.label}
                            </option>
                          ))}
                        </Select>
                        {fieldType === "boolean" ? (
                          <Select
                            width="150px"
                            placeholder="Select Value"
                            value={row.value}
                            onChange={(e) =>
                              updateFilterValue(row.id, "value", e.target.value)
                            }
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
                            onChange={(e) =>
                              updateFilterValue(row.id, "value", e.target.value)
                            }
                            borderRadius="0"
                          />
                        ) : (
                          <Input
                            placeholder="Enter a value"
                            width="150px"
                            value={row.value}
                            onChange={(e) =>
                              updateFilterValue(row.id, "value", e.target.value)
                            }
                            borderRadius="0"
                          />
                        )}
                      </>
                    );
                  })()}

                  <Button
                    onClick={() => removeRow(row.id)}
                    variant="outline"
                    borderLeftRadius="0"
                  >
                    <Icon as={MdOutlineDelete} />
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
