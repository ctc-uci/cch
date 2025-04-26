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
import { camelToSnakeCase } from "../../utils/camelCase.ts";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV.ts";
import { CaseManagerMonthlyTableBody } from "./CaseManagerMonthlyTableBody.tsx";
import {
  formatDataWithLabels,
} from "./DataFormatter.tsx";
import { FrontDeskMonthlyTableBody } from "./FrontDeskTableBody.tsx";
import { InitialScreenerTableBody } from "./InitialScreenerTableBody.tsx";
import { IntakeStatisticsTableBody } from "./IntakeStatisticsTableBody.tsx";
import { RequestFormPreview } from "./RequestFormPreview.tsx";

export const FormPreview = ({
  formItemId,
  formItemTitle,
  formItemName,
  formItemDate,
  isOpen,
  onClose,
  setRefreshTable
}: {
  formItemId: number;
  formItemTitle: string;
  formItemName: string;
  formItemDate: string;
  isOpen: boolean;
  onClose: () => void;
  setRefreshTable: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const toast = useToast();

  const [formData, setFormData] = useState({});
  const [newFormData, setNewFormData] = useState({});

  const [newFormattedModifiedData, setFormattedModifiedData] = useState({});
  const [formattedFormData, setFormattedFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const renderTableBody = () => {
    switch (formItemTitle) {
      case "Initial Screeners":
        return (
          <InitialScreenerTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Client Tracking Statistics (Intake Statistics)":
        return (
          <IntakeStatisticsTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Front Desk Monthly Statistics":
        return (
          <FrontDeskMonthlyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Case Manager Monthly Statistics":
        return (
          <CaseManagerMonthlyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
    }
  };

  useEffect(() => {
    const getData = async () => {
      let endpoint = "";

      switch (formItemTitle) {
        case "Initial Screeners":
          endpoint = `/initialInterview/get-interview/${formItemId}`;
          break;
        case "Client Tracking Statistics (Intake Statistics)":
          endpoint = `/intakeStatsForm/${formItemId}`;
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
        setFormData(response.data[0]);
        setNewFormData(response.data[0]);
        setFormattedFormData(data); // human readable keys
        setFormattedModifiedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [backend, formItemTitle, formItemId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveForm = async () => {
    // setNewFormData(formData);

    let endpoint = "";

    switch (formItemTitle) {
      case "Initial Screeners":
        endpoint = `/initialInterview/${formData.id}`;
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
      if (
        formItemTitle === "Front Desk Monthly Statistics" ||
        formItemTitle === "Initial Screeners"
      ) {
        await backend.put(endpoint, camelToSnakeCase(newFormData));
      } else {
        console.log(newFormData)
        await backend.put(endpoint, newFormData);
      }
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
    setRefreshTable((prev) => !prev);
    setFormattedFormData(newFormattedModifiedData);
    setFormData(newFormData);
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
        setFormattedModifiedData(formattedFormData);
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
                  setFormattedModifiedData(formattedFormData);
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
            <RequestFormPreview/>
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
                      const data = Object.entries(formattedFormData).map(
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
                      // setFormattedModifiedData(formattedFormData);
                      setNewFormData(formData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleSaveForm}
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
                    {!isEditing
                      ? Object.entries(newFormattedModifiedData).map(
                          ([key, value]) => (
                            <Tr key={key}>
                              <Td>{key}</Td>
                              <Td>{isDate(value) ? formatDateString(value): value}</Td>
                            </Tr>
                          )
                        )
                      : renderTableBody()}
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
