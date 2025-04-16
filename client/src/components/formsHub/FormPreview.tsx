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
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext.ts";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV.ts";
import {
  formatDataWithLabels,
  getKeyByValue, reverseLabelKeys,
} from "./DataFormatter.tsx";
import { RequestFormPreview } from "./RequestFormPreview.tsx";

export const FormPreview = ({
  formItemId,
  formItemTitle,
  formItemName,
  formItemDate,
  isOpen,
  onClose,
}: {
  formItemId: number;
  formItemTitle: string;
  formItemName: string;
  formItemDate: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const toast = useToast();

  const [formData, setFormData] = useState({});
  const [newFormData, setNewFormData] = useState({});

  const [newFormattedFormData, setNewFormattedFormData] = useState({});
  const [formattedFormData, setFormattedFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getData = async () => {
      let endpoint = "";

      switch (formItemTitle) {
        case "Initial Screeners":
          endpoint = `/initialInterview/get-interview/${formItemId}`;
          break;
        case "Client Tracking Statistics (Intake Statistics)":
          endpoint = `/intakeStats/${formItemId}`;
          break;
        case "Front Desk Monthly Statistics":
          endpoint = `/frontDesk/${formItemId}`;
          break;
        case "Case Manager Monthly Statistics":
          endpoint = `/caseManagerMonthlyStats/${formItemId}`;
          break;
        default:
          console.error("Unknown form title:", formItemTitle);
          setIsLoading(false);
          return;
      }

      try {
        setIsLoading(true);

        const response = await backend.get(endpoint);
        const data = formatDataWithLabels(response.data[0], formItemTitle);

        console.log(response.data[0]);

        setFormData(response.data[0]);
        setNewFormData(response.data[0]);

        setFormattedFormData(data);
        setNewFormattedFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [backend, formItemTitle, formItemId]);

  const handleSaveForm = async () => {
    let endpoint = "";

    switch (formItemTitle) {
      case "Initial Screeners":
        endpoint = `/initialInterview/`;
        break;
      case "Front Desk Monthly Statistics":
        endpoint = `/frontDesk/`;
        break;
      case "Case Manager Monthly Statistics":
        endpoint = `/caseManagerMonthlyStats/`;
        break;
      default:
        console.error("Unknown form title:", formItemTitle);
        return;
    }

    try {
      console.log(reverseLabelKeys(newFormattedFormData, formItemTitle))
      await backend.post(endpoint, reverseLabelKeys(newFormattedFormData, formItemTitle));
    } catch (error) {
      console.error("Error updating form:", error);

      toast({
        title: "Did Not Save Changes",
        description: `There was an error while saving changes`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    toast({
      title: "Successfully submitted form",
      description: `${formItemTitle} Form - ${new Date().toLocaleString()}`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    onClose();
    setFormattedFormData(newFormattedFormData);
    setFormData(newFormData)
    setIsEditing(false);
  };

  const isDate = (value: string) => {
    return (
      Object.prototype.toString.call(value) === "[object String]" &&
      !isNaN(Date.parse(value))
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        onClose();
        setNewFormattedFormData(formattedFormData);
        setNewFormData(formData);
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
                  setNewFormattedFormData(formattedFormData);
                  setNewFormData(formData);
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
              {formItemName && `${formItemName} - `}
              {formItemTitle} {formatDateString(formItemDate)}
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
          ) : role === "user" &&
            formItemTitle ===
              "Client Tracking Statistics (Intake Statistics)" ? (
            RequestFormPreview()
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
                      setNewFormData(formData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={() => {
                      handleSaveForm().then();
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
                                <>
                                  {isDate(value)
                                    ? formatDateString(value)
                                    : value}
                                </>
                              ) : (
                                <Input
                                  value={value}
                                  onChange={(event) => {
                                    const realKey = getKeyByValue(
                                      key,
                                      formItemTitle
                                    );
                                    const originalValue = formData[realKey];

                                    // event.target.value is a string
                                    // it needs to be casted to match the type in the actual form
                                    let newValue:
                                      | string
                                      | number
                                      | boolean
                                      | Date = event.target.value;

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

                                    if(isNaN(newValue)) {
                                      return;
                                    }

                                    setNewFormData((prev) => ({
                                      ...prev,
                                      [realKey]: newValue,
                                    }));

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
