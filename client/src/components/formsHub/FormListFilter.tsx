import { useState } from "react";
import {
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
  useToast,
} from "@chakra-ui/react";
import { MdOutlineAdd, MdOutlineDelete, MdOutlineFilterAlt } from "react-icons/md";

interface FormFilter {
  id: number;
  field: string;
  operator: string;
  value: string;
  selector?: string;
}

interface FormsListFilterProps {
  filterRows: FormFilter[];
  setFilterRows: React.Dispatch<React.SetStateAction<FormFilter[]>>;
}

export const FormsListFilter = ({ filterRows, setFilterRows }: FormsListFilterProps) => {
  const toast = useToast();
  const [nextId, setNextId] = useState(2);

  const columns = [
    { name: "Date", value: "date", type: "date" },
    { name: "Name", value: "name", type: "string" },
    { name: "Form Title", value: "title", type: "string" },
  ];

  const addNewRow = () => {
    const last = filterRows[filterRows.length - 1];
    if (!last?.field || !last?.operator || !last?.value) {
      toast({
        title: "Incomplete filter",
        description: "Fill in all fields before adding a new one.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFilterRows([
      ...filterRows,
      { id: nextId, field: "", operator: "", value: "", selector: "AND" },
    ]);
    setNextId(prev => prev + 1);
  };

  const removeRow = (id: number) => {
    const updated = filterRows.filter(row => row.id !== id);
    if (updated.length === 0) {
      setFilterRows([{ id: 1, field: "", operator: "", value: "" }]);
    } else {
      setFilterRows(updated.map((row, idx) => ({ ...row, selector: idx === 0 ? undefined : row.selector })));
    }
  };

  const updateValue = (id: number, key: keyof FormFilter, value: string) => {
    setFilterRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button background={"white"}>
          <HStack>
            <Icon as={MdOutlineFilterAlt} />
            <Text>Filter</Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent width="auto" p={2}>
        <PopoverArrow />
        <PopoverBody>
          <VStack spacing={4} align="stretch" width={"100%"}>
            <Text fontSize="14px" fontWeight="300">In this view, show records</Text>
            {filterRows.map((row, index) => {
              const type = columns.find(c => c.value === row.field)?.type || "string";
              const ops =
                type === "string"
                  ? [
                      { value: "contains", label: "contains" },
                      { value: "=", label: "equals" },
                    ]
                  : [
                      { value: "=", label: "equals" },
                      { value: "!=", label: "not equals" },
                    ];

              return (
                <HStack key={row.id} spacing={0} align="center">
                  {index === 0 ? (
                    <Text fontWeight="medium" fontSize="md" marginRight={"47px"}>Where</Text>
                  ) : (
                    <Select
                      value={row.selector || "AND"}
                      onChange={e => updateValue(row.id, "selector", e.target.value)}
                      width={"80px"}
                      marginRight={"14px"}
                    >
                      <option value="AND">and</option>
                      <option value="OR">or</option>
                    </Select>
                  )}

                  <Select
                    placeholder="Select Field"
                    width="150px"
                    value={row.field}
                    onChange={e => updateValue(row.id, "field", e.target.value)}
                    borderRightRadius="0"
                  >
                    {columns.map(col => (
                      <option key={col.value} value={col.value}>{col.name}</option>
                    ))}
                  </Select>

                  <Select
                    placeholder="Select Operator"
                    width="150px"
                    value={row.operator}
                    onChange={e => updateValue(row.id, "operator", e.target.value)}
                    borderRadius="0"
                  >
                    {ops.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </Select>

                  {type === "date" ? (
                    <Input
                      type="date"
                      width="150px"
                      value={row.value}
                      onChange={e => updateValue(row.id, "value", e.target.value)}
                      borderRadius="0"
                    />
                  ) : (
                    <Input
                      placeholder="Enter value"
                      width="150px"
                      value={row.value}
                      onChange={e => updateValue(row.id, "value", e.target.value)}
                      borderRadius="0"
                    />
                  )}

                  <Button onClick={() => removeRow(row.id)} variant="outline" borderLeftRadius="0">
                    <Icon as={MdOutlineDelete} />
                  </Button>
                </HStack>
              );
            })}
            <Button onClick={addNewRow} leftIcon={<MdOutlineAdd />} size="sm" variant="ghost">
              Add Filter
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
