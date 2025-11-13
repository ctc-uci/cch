import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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
import { formatDataWithLabels } from "./DataFormatter.tsx";
import { ExitSurveyTableBody } from "./ExitSurveyTableBody.tsx";
import { FrontDeskMonthlyTableBody } from "./FrontDeskTableBody.tsx";
import { InitialScreenerTableBody } from "./InitialScreenerTableBody.tsx";
import { IntakeStatisticsTableBody } from "./IntakeStatisticsTableBody.tsx";
import { RandomSurveyTableBody } from "./RandomSurveyTableBody.tsx";
import { RequestFormPreview } from "./RequestFormPreview.tsx";
import { SuccessStoryTableBody } from "./SuccessStoryTableBody.tsx";

type FormItem = {
  id: number;
  title: string;
  name?: string;
  date?: string;
  [key: string]: unknown;
};

type FormDataRecord = Record<string, unknown>;

const FormPreview = ({
  clickedFormItem,
  isOpen,
  onClose,
  refreshTable,
  setRefreshTable,
}: {
  clickedFormItem: FormItem;
  isOpen: boolean;
  onClose: () => void;
  refreshTable: boolean;
  setRefreshTable: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const {
    id: formItemId,
    title: formItemTitle,
    name: formItemName,
    date: formItemDate,
  } = clickedFormItem;

  const toast = useToast();

  const [formData, setFormData] = useState<FormDataRecord>({});
  const [newFormData, setNewFormData] = useState<FormDataRecord>({});

  const [newFormattedModifiedData, setFormattedModifiedData] =
    useState<FormDataRecord>({});
  const [formattedFormData, setFormattedFormData] =
    useState<FormDataRecord>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitial, setIsInitial] = useState(false);
  const navigate = useNavigate();

  const handleCommentForm = async () => {
    const commentId = await backend.get(`/screenerComment/interview/${formItemId}`)
    const result = commentId.data?.['result']?.[0];
    if (!result || typeof result.id === "undefined") {
      toast({
        title: "Comment Form Not Found",
        description: "No comment form is associated with this interview.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    navigate(`/comment-form/${result}`)
  }

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
      case "Exit Surveys":
        return (
          <ExitSurveyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Success Stories":
        return (
          <SuccessStoryTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Random Client Surveys":
        return (
          <RandomSurveyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
    }
  };

  useEffect(() => {
    setFormData({});
    setNewFormData({});
    setFormattedFormData({});
    setFormattedModifiedData({});
    setIsEditing(false);
    setIsLoading(true);

    setIsInitial(formItemTitle === "Initial Screeners");
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
        case "Exit Surveys":
          endpoint = `/exitSurvey/${formItemId}`;
          break;
        case "Success Stories":
          endpoint = `/successStory/${formItemId}`;
          break;
        case "Random Client Surveys":
          endpoint = `/randomSurvey/${formItemId}`;
          break;
        default:
          console.error("Unknown form title:", formItemTitle);
          return;
      }

      try {
        const response = await backend.get(endpoint);
        let normalData: FormDataRecord | undefined = response.data?.[0];

        if (formItemTitle === "Exit Surveys") {
          normalData = response.data?.data?.[0];
        } else if (formItemTitle === "Random Client Surveys") {
          normalData = response.data;
        }

        if (!normalData || typeof normalData !== "object") {
          setFormData({});
          setNewFormData({});
          setFormattedFormData({});
          setFormattedModifiedData({});
          return;
        }

        const data = formatDataWithLabels(normalData, formItemTitle);
        setFormData({ ...normalData });
        setNewFormData({ ...normalData });
        setFormattedFormData(data); // human readable keys
        setFormattedModifiedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [backend, formItemId, formItemTitle, refreshTable]);

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
    let endpoint = "";

    switch (formItemTitle) {
      case "Initial Screeners":
        endpoint = `/initialInterview/${formItemId}`;
        break;
      case "Front Desk Monthly Statistics":
        endpoint = `/frontDesk/${formItemId}`;
        break;
      case "Case Manager Monthly Statistics":
        endpoint = `/caseManagerMonthlyStats/${formItemId}`;
        break;
      case "Exit Surveys":
        endpoint = `/exitSurvey/${formItemId}`;
        break;
      case "Success Stories":
        endpoint = `/successStory/${formItemId}`;
        break;
      case "Random Client Surveys":
        endpoint = `/randomSurvey/${formItemId}`;
        break;
      default:
        console.error("Unknown form title:", formItemTitle);
        return;
    }

    try {
      if (
        formItemTitle === "Front Desk Monthly Statistics" ||
        formItemTitle === "Initial Screeners" ||
        formItemTitle === "Exit Surveys"
      ) {
        await backend.put(endpoint, camelToSnakeCase(newFormData));
      } else {
        await backend.put(endpoint, newFormData);
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
    } catch (error) {
      console.error("Error updating form:", error);

      toast({
        title: "Did Not Save Changes",
        description: `There was an error while saving changes`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const isDate = (value: string) => {
    return (
      Object.prototype.toString.call(value) === "[object String]" &&
      !isNaN(Date.parse(value))
    );
  };

  const formatValueForDisplay = (value: unknown) => {
    if (typeof value === "string") {
      return isDate(value) ? formatDateString(value) : value;
    }

    if (value === null || value === undefined) {
      return "";
    }

    return String(value);
  };

  const formatValueForExport = (value: unknown) => {
    if (value === null || value === undefined) {
      return "";
    }

    return typeof value === "string" ? value : String(value);
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
              {formItemTitle}{" "}
              {formItemDate ? formatDateString(formItemDate) : ""}
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
            <RequestFormPreview
              cmId={
                typeof formData["cmId"] === "number"
                  ? (formData["cmId"] as number)
                  : undefined
              }
              clientEmail={
                typeof formData["email"] === "string"
                  ? (formData["email"] as string)
                  : undefined
              }
              onClose={onClose}
            />
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
                  {isInitial ? (
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="lg"
                      onClick={() => handleCommentForm()}
                    >
                      Open Comment Form
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    colorScheme="blue"
                    float="right"
                    size="lg"
                    onClick={() => {
                      const headers = ["Questions", "Answer"];
                      const data = Object.entries(formattedFormData).map(
                        ([key, value]) => ({
                          Questions: key,
                          Answer: formatValueForExport(value),
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
                overflowY="auto"
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
                              <Td>
                                {formatValueForDisplay(value)}
                              </Td>
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

export default FormPreview;
