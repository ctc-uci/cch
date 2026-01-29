import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Portal,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { IntakeStatisticsForm } from "../../types/intakeStatisticsForm";
import { Navbar } from "../Navbar";
import { IntakeStatsPg1, IntakeStatsPg2 } from "./intakeStatsPgs";
import { ArrowBackIcon } from "@chakra-ui/icons";

const initialFormData: IntakeStatisticsForm = {
  date: new Date().toISOString(),
  firstName: "",
  lastName: "",
  birthday: "",
  age: 0,
  phoneNumber: "",
  email: "",
  emergencyContactName: "",
  emergencyContactPhoneNumber: "",
  priorLivingSituation: "",
  entryDate: "",
  medical: undefined,
  assignedCaseManager: "",
  site: "",
  clientGrant: "",
  calOptimaFundedSite: undefined,
  uniqueId: "",
  disablingConditionForm: undefined,
  familySize: 0,
  numberOfChildren: 0,
  numberOfChildrenWithDisability: 0,
  children: [],
  month: "",
  caseManager: "",
  race: "",
  ethnicity: "",
  pregnant: undefined,
  cityLastPermanentAddress: "",
  whereClientSleptLastNight: "",
  lastCityResided: "",
  lastCityHomeless: "",
  beenInShelterLast5Years: undefined,
  numberofSheltersLast5Years: 0,
  durationHomeless: "",
  chronicallyHomeless: undefined,
  employedUponEntry: undefined,
  attendingSchoolUponEntry: undefined,
  signedPhotoRelease: undefined,
  highRisk: undefined,
  currentlyEmployed: undefined,
  dateLastEmployment: "",
  historyDomesticViolence: undefined,
  historySubstanceAbuse: undefined,
  supportSystem: undefined,
  supportHousing: false,
  supportFood: false,
  supportChildcare: false,
  diagnosedMentalHealth: undefined,
  undiagnosedMentalHealth: undefined,
  transportation: undefined,
  convictedCrime: undefined,
};

export const IntakeStats = () => {
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const [onReview, setOnReview] = useState<boolean>(false);
  const [formData, setFormData] =
    useState<IntakeStatisticsForm>(initialFormData);

  const { backend } = useBackendContext();
  const toast = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current && formRef.current.checkValidity()) {
      if (pageNum === 1) {
        setPageNum(2);
      } else if (pageNum === 2) {
        setOnReview(true)
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields before submitting.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handlePrev = () => {
    setPageNum(1);
  };

  const handlePrepareSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = "unique-toast";
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        isClosable: true,
        position: "top",
        containerStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        render: ({ onClose }) => (
          <Portal>
            <Box
              p={4}
              bg="white"
              color="black"
              borderRadius="md"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex="9999"
              boxShadow="lg"
              position="fixed"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Text
                fontSize="lg"
                color="black"
                fontWeight="bold"
              >
                Warning!
              </Text>
              <span>
                You will not be able to view or edit this form after submission.
              </span>
              <HStack>
                <Button
                  ml={4}
                  size="sm"
                  backgroundColor="#ffffff"
                  color="#4398cd"
                  border="2px solid #4398cd"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Continue Reviewing
                </Button>
                <Button
                  ml={4}
                  size="sm"
                  backgroundColor="#4398cd"
                  color="#ffffff"
                  onClick={() => {
                    handleSubmit();
                    onClose();
                  }}
                >
                  Submit
                </Button>
              </HStack>
            </Box>
          </Portal>
        ),
      });
    }
  };

  const handleSubmit = async () => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString(),
    }));

    if (!(formRef.current && formRef.current.checkValidity())) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields before submitting.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      await backend.post("/intakeStatsForm", formData);
      toast({
        title: "Successfully submitted form",
        description: `Intake Statistics Form - ${new Date().toLocaleString()}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/forms-hub");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      backgroundColor="#EDF2F7"
      minHeight="100vh"
      width="100%"
      paddingTop="2%"
      overflowY="hidden"
    >
      
      {onReview === false ? (
        <Box
          backgroundColor="#FFFFFF"
          margin="0 8% 3% 8%"
          borderRadius="md"
          overflow="auto"
        >
        {/* <Navbar /> */}
        <HStack position="absolute" p="4">
          <Button
            variant="ghost"
            colorScheme="blue"
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate("/forms-hub")}
          >
            Back
          </Button>
        </HStack>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pt="6vh"
          >
            <HStack
              w="65%"
              justify="center"
              align="center"
              spacing={4}
            >
              <Text
                fontSize="sm"
                whiteSpace="nowrap"
              >
                Page {pageNum} of 2
              </Text>
              <Progress
                color="#4398cd"
                value={100}
                w="100%"
                borderTopLeftRadius="full"
                borderBottomLeftRadius="full"
              />
              <Progress
                color="#4398cd"
                value={pageNum === 1 ? 0 : 100}
                w="100%"
                borderTopRightRadius="full"
                borderBottomRightRadius="full"
              />
            </HStack>
          </Box>
          <Heading
            marginTop={4}
            textAlign="center"
          >
            Intake Statistical Form
          </Heading>
          <Box
            pt={10}
            mt={4}
          >
            {pageNum === 1 ? (
              <Box>
                <form
                  ref={formRef}
                  onSubmit={handleNext}
                >
                  <IntakeStatsPg1
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <HStack
                    justifyContent="flex-end"
                    width="100%"
                    px={10}
                    mt={4}
                    mb={3}
                  >
                    <Button
                      backgroundColor="#4398cd"
                      color="#ffffff"
                      type="submit"
                    >
                      Next
                    </Button>
                  </HStack>
                </form>
              </Box>
            ) : (
              <Box>
                <form
                  ref={formRef}
                  onSubmit={handleNext}
                >
                  <IntakeStatsPg2
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <HStack
                    justifyContent="space-between"
                    width="100%"
                    px={10}
                    mt={4}
                    mb={3}
                  >
                    <Button
                      border="2px solid #4398cd"
                      backgroundColor="#ffffff"
                      color="#4398cd"
                      onClick={handlePrev}
                    >
                      Last Page
                    </Button>
                    <Button
                      backgroundColor="#4398cd"
                      color="#ffffff"
                      onClick={handleNext}
                    >
                      Review
                    </Button>
                  </HStack>
                </form>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <>
          <form
            ref={formRef}
            onSubmit={handlePrepareSubmit}
          >
            <Box
              backgroundColor="#FFFFFF"
              margin="0 8% 3% 8%"
              borderRadius="md"
              maxHeight="85vh"
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                pt="6vh"
              >
                <HStack
                  w="50%"
                  justify="center"
                  align="center"
                  spacing={4}
                >
                  <Text
                    fontSize="sm"
                    whiteSpace="nowrap"
                  >
                    Page 1 of 2
                  </Text>
                  <Progress
                    color="#4398cd"
                    value={100}
                    w="100%"
                    borderRadius="full"
                  />
                  <Progress
                    color="#4398cd"
                    value={0}
                    w="100%"
                    borderRadius="full"
                  />
                </HStack>
              </Box>
              <Heading
                marginTop={4}
                textAlign="center"
              >
                Intake Statistical Form
              </Heading>
              <Box
                pt={10}
                mt={4}
              >
                <IntakeStatsPg1
                  formData={formData}
                  setFormData={setFormData}
                />
              </Box>
            </Box>

            <Box
              backgroundColor="#FFFFFF"
              margin="0 8% 1% 8%"
              borderRadius="md"
              maxHeight="85vh"
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                pt="6vh"
              >
                <HStack
                  w="50%"
                  justify="center"
                  align="center"
                  spacing={4}
                >
                  <Text
                    fontSize="sm"
                    whiteSpace="nowrap"
                  >
                    Page 2 of 2
                  </Text>
                  <Progress
                    color="#4398cd"
                    value={100}
                    w="100%"
                    borderRadius="full"
                  />
                  <Progress
                    color="#4398cd"
                    value={100}
                    w="100%"
                    borderRadius="full"
                  />
                </HStack>
              </Box>
              <Heading
                marginTop={4}
                textAlign="center"
              >
                Intake Statistical Form
              </Heading>
              <Box
                pt={10}
                mt={4}
              >
                <IntakeStatsPg2
                  formData={formData}
                  setFormData={setFormData}
                />
              </Box>
            </Box>

            <Box
              width="100%"
              pb="20px"
              display="flex"
            >
              <HStack
                justifyContent="flex-end"
                width="100%"
              >
                <Button
                  backgroundColor="#4398cd"
                  color="#ffffff"
                  mr="5%"
                  type="submit"
                >
                  Submit
                </Button>
              </HStack>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};
