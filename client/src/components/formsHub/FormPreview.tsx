import { useEffect, useState } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDataWithLabels, getKeyByValue } from "./DataFormatter.tsx";
import { FormItem } from "./formsTable";
import {downloadCSV} from "../../utils/downloadCSV.ts";

export const FormPreview = ({
  formItem,
  isOpen,
  onClose,
}: {
  formItem: FormItem;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();

  const [formData, setFormData] = useState({});
  const [newFormattedFormData, setNewFormattedFormData] = useState({});
  const [formattedFormData, setFormattedFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const userId = formItem.id;

  const titleToGetEndpoint: Record<FormItem["title"], string> = {
    "Initial Screeners": `/initialInterview/get-interview/${userId}`,
    "Intake Statistics": "",
    "Front Desk Monthly Statistics": `/frontDesk/get-stat/${userId}`,
    "Case Manager Monthly Statistics": `/caseManagers/${userId}`,
  };

  useEffect(() => {
    const getData = async () => {
      if (isOpen) return;

      const endpoint = titleToGetEndpoint[formItem.title];

      if (endpoint === "") {
        setFormData({});

        return;
      }

      try {
        const response = await backend.get(`${endpoint}`);
        const data = formatDataWithLabels(response.data[0], formItem.title);

        setFormData(response.data[0]);

        setFormattedFormData(data);
        setNewFormattedFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [isOpen, backend, formItem, titleToGetEndpoint]);

  const handleSaveForm = async () => {
    // do the put requests and error handling
  }

  const isDate = (value: any) => {
    return (
      Object.prototype.toString.call(value) === "[object Date]" ||
      (typeof value === "string" && !isNaN(Date.parse(value)))
    );
  }

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
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
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
            <Text fontWeight="bold">Form Preview</Text>
            <Text color="gray.600">
              {formItem.name} - {formItem.title} {formItem.date}
            </Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          {!isEditing ? (
            <HStack>
              <Button
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
              >
                Edit Form
              </Button>

              <Button
                colorScheme="blue"
                float="right"
                onClick={() => {
                  const headers = ["Questions", "Answer"];
                  const data = Object.entries(newFormattedFormData).map(([key, value]) => ({
                    Questions: key,
                    Answer: value
                  }));
                  downloadCSV(headers, data, "form.csv");
                }}
              >
                Export Form
              </Button>
            </HStack>
          ) : (
            <HStack
              spacing={3}
              justify="flex-end"
              mt={6}
            >
              <Button
                variant="ghost"
                onClick={() => {
                  setNewFormattedFormData(formattedFormData);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
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

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>QUESTION</Th>
                <Th>ANSWER</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(newFormattedFormData).length > 0 &&
                Object.entries(newFormattedFormData).map(([key, value]) => (
                  <Tr key={key}>
                    <Td>{key}</Td>
                    <Td>
                      {!isEditing ? (
                        <>{value}</>
                      ) : (
                        <Input
                          value={value ?? ""}
                          onChange={(event) => {
                            const originalValue = formattedFormData[key];

                            // event.target.value is a string
                            // it needs to be casted to match the type in the actual form
                            let newValue: any = event.target.value;

                            if (typeof originalValue === "number") {
                              newValue = Number(newValue);
                            } else if (typeof originalValue === "boolean") {
                              newValue = newValue.toLowerCase() === "true";
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
                ))}
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
