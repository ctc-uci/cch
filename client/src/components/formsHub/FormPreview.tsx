import { useEffect, useState } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  HStack,
  IconButton,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { Form } from "../../types/form";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV.ts";
import { formatDataWithLabels, getKeyByValue } from "./DataFormatter.tsx";

export const FormPreview = ({
  formItem,
  isOpen,
  onClose,
}: {
  formItem: Form;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();

  const [formData, setFormData] = useState({});
  const [newFormattedFormData, setNewFormattedFormData] = useState({});
  const [formattedFormData, setFormattedFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getData = async () => {
      let endpoint = "";
      console.log(formItem)

      switch (formItem.title) {
        case "Initial Screeners":
          endpoint = `/initialInterview/get-interview/${formItem.id}`;
          break;
        case "Client Tracking Statistics (Intake Statistics)":
          endpoint = `/intakeStats/${formItem.id}`;
          break;
        case "Front Desk Monthly Statistics":
          endpoint = `/frontDesk/${formItem.id}`;
          break;
        case "Case Manager Monthly Statistics":
          endpoint = `/caseManagerMonthlyStats/${formItem.id}`;
          break;
        default:
          console.error("Unknown form title:", formItem.title);
          setIsLoading(false);
          return;
      }

      try {
        setIsLoading(true);
        const response = await backend.get(endpoint);
        console.log(response)
        const data = await formatDataWithLabels(response.data[0], formItem.title);
        console.log(data)

        setFormData(response.data[0]);
        setFormattedFormData(data);
        setNewFormattedFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [backend, formItem]);

  const handleSaveForm = async () => {
    // do the put requests and error handling
  };

  const isDate = (value: any) => {
    return (
      Object.prototype.toString.call(value) === "[object Date]" ||
      (typeof value === "string" && !isNaN(Date.parse(value)))
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        onClose();
        setIsEditing(false);
      }}
      size="xl"
    >
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={27}>
            <HStack spacing={2}>
              <IconButton
                as={ChevronRightIcon}
                color="blue.500"
                aria-label="Close drawer"
                onClick={() => {
                  onClose();
                  setIsEditing(false);
                }}
                variant="ghost"
                size="sm"
              />
              <Text fontSize="md">Form Preview</Text>
            </HStack>
            <Text
              color="gray.600"
              fontSize="md"
            >
              {formItem.name} - {formItem.title} {formatDateString(formItem.date)}
            </Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          {isLoading ? (
            <VStack
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Spinner
                size="xl"
                color="blue.500"
              />
              <Text>Loading...</Text>
            </VStack>
          ) : (
            <VStack
              marginTop="12px"
              spacing="24px"
            >
              {!isEditing ? (
                <HStack
                  width="100%"
                  justifyContent="space-between"
                >
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Form
                  </Button>
                  <Button
                    colorScheme="blue"
                    float="right"
                    size="lg"
                    onClick={() => {
                      const headers = ["Questions", "Answer"];
                      const data = Object.entries(newFormattedFormData).map(
                        ([key, value]) => ({
                          Questions: key,
                          Answer: value,
                        })
                      );
                      downloadCSV(headers, data, "form.csv");
                    }}
                  >
                    Export Form
                  </Button>
                </HStack>
              ) : (
                <HStack
                  spacing={3}
                  w="100%"
                  justifyContent="flex-end"
                >
                  <Button
                    variant="solid"
                    colorScheme="gray"
                    size="lg"
                    onClick={() => {
                      setNewFormattedFormData(formattedFormData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={() => {
                      setFormattedFormData(newFormattedFormData);
                      handleSaveForm();
                      setIsEditing(false);
                    }}
                  >
                    Save
                  </Button>
                </HStack>
              )}
              <TableContainer
                w="100%"
                border="1px"
                borderColor="gray.200"
                borderRadius="12px"
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="md"
                        color="gray.700"
                      >
                        Question
                      </Th>
                      <Th
                        fontSize="md"
                        color="gray.700"
                      >
                        Answer
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.keys(newFormattedFormData).length > 0 &&
                      Object.entries(newFormattedFormData).map(
                        ([key, value]) => (
                          <Tr key={key}>
                            <Td fontSize="medium">{key}</Td>
                            <Td fontSize="medium">
                              {!isEditing ? (
                                <>{value}</>
                              ) : (
                                <Input
                                  value={value ?? ""}
                                  onChange={(event) => {
                                    const originalValue =
                                      formattedFormData[key];

                                    // event.target.value is a string
                                    // it needs to be casted to match the type in the actual form
                                    let newValue: any = event.target.value;

                                    if (typeof originalValue === "number") {
                                      newValue = Number(newValue);
                                    } else if (
                                      typeof originalValue === "boolean"
                                    ) {
                                      newValue =
                                        newValue.toLowerCase() === "true";
                                    } else if (isDate(originalValue)) {
                                      const parsedDate = new Date(newValue);

                                      if (!isNaN(parsedDate.getTime())) {
                                        newValue = parsedDate.toISOString();
                                      }
                                    }

                                    setNewFormattedFormData((prev) => ({
                                      ...prev,
                                      [key]: newValue,
                                    }));
                                  }}
                                ></Input>
                              )}
                            </Td>
                          </Tr>
                        )
                      )}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
