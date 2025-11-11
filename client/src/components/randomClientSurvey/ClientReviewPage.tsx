import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
  Divider,
  OrderedList,
  ListItem,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Circle,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const qualityQuestions = [
  "The service you received from your case manager.",
  "The quality of the service in the CCH program.",
  "The cleanliness of your unit.",
  "The quality of your unit.",
  "The quality of your entrance into the CCH program.",
  "The overall experience at CCH."
];

const qualityQuestionNames = [
  "cm_qos",
  "cch_qos",
  "clean",
  "unit_quality",
  "entry_quality",
  "overall_experience",
];

type SurveyData = {
  date: string | Date;
  cch_qos: number;
  cm_qos: number;
  courteous?: boolean;
  informative?: boolean;
  prompt_and_helpful?: boolean;
  entry_quality: number;
  unit_quality: number;
  clean: number;
  overall_experience: number;
  case_meeting_frequency: string;
  lifeskills?: boolean;
  recommend?: boolean;
  recommend_reasoning: string;
  make_cch_more_helpful: string;
  cm_id: number;
  cm_feedback: string;
  other_comments: string;
};

type CaseManager = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
};

type ErrorState = {
  qualityQuestions: boolean;
  courteous: boolean;
  informative: boolean;
  prompt_and_helpful: boolean;
  case_meeting_frequency: boolean;
  lifeskills: boolean;
  recommend: boolean;
  recommend_reasoning: boolean;
  date: boolean;
  cm_id: boolean;
};

type ClientReviewPageProps = {
  surveyData: SurveyData;
  setSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
  errors: ErrorState;
  setErrors: React.Dispatch<React.SetStateAction<ErrorState>>;
  onNext: () => void;
  caseManagers: CaseManager[];
};

export const ClientReviewPage = ({
  surveyData,
  setSurveyData,
  errors,
  setErrors,
  onNext,
  caseManagers
}: ClientReviewPageProps)  => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleValidateAndNext = async () => {
    const newErrors: ErrorState = {
      qualityQuestions: qualityQuestionNames.some((key) => {
        const val = surveyData[key as keyof SurveyData];
        return typeof val !== "number" || val < 1 || val > 5;
      }),
      courteous: typeof surveyData.courteous !== "boolean",
      informative: typeof surveyData.informative !== "boolean",
      prompt_and_helpful: typeof surveyData.prompt_and_helpful !== "boolean",
      case_meeting_frequency: !surveyData.case_meeting_frequency,
      lifeskills: typeof surveyData.lifeskills !== "boolean",
      recommend: typeof surveyData.recommend !== "boolean",
      recommend_reasoning: !surveyData.recommend_reasoning.trim(),
      date: !surveyData.date,
      cm_id: !surveyData.cm_id,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) {
      toast({
        title: "Missing required fields",
        description: "Please complete all required questions before submitting.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onNext();
  };

  return (
    <VStack
      sx={{ width: 700, marginX: "auto", padding: "20px" }}
      alignItems={"start"}
    >
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        marginTop={"30px"}
      >
        <Box
          width={"200px"}
          position={"relative"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={"100px"}
        >
          <Button
            position={"absolute"}
            left={"-250px"}
            top={"10px"}
            height={"40px"}
            width={"40px"}
            color={"blue.500"}
            backgroundColor={"transparent"}
            onClick={() => navigate("/client-landing-page")}
          >
            <Box fontSize={"35px"}>
              <IoIosArrowBack />
            </Box>
          </Button>
          <Box
            position="absolute"
            top="16px"
            left="55px"
            height="2px"
            width={"109px"}
            borderTop="1px dashed #3182CE"
            zIndex={0}
          />
          <VStack>
          <Circle
            size={"32px"}
            backgroundColor={"blue.500"}
            border="1px solid #3182CE"
            color={"white"}
          >
            1
          </Circle>
          <Text
            fontSize={"12px"}
            fontStyle={"normal"}
            fontWeight={"400"}
            lineHeight={"16px"}
          >
            Client Review
          </Text>
          </VStack>
          <VStack>
          <Circle
            size={"32px"}
            backgroundColor={"white"}
            border="1px"
            borderColor={"blue.500"}
            color={"blue.500"}
          >
            2
          </Circle>
          <Text
            fontSize={"12px"}
            fontStyle={"normal"}
            fontWeight={"400"}
            lineHeight={"16px"}
          >
            Review
          </Text>
          </VStack>
        </Box>
      </Box>
      <Heading
        color={"#3182CE"}
        textAlign={"center"}
        fontSize={"30px"}
        fontStyle={"normal"}
        fontWeight={"400"}
        lineHeight={"150%"}
      >
        How are we doing?
      </Heading>
      <Text
        color={"#656464"}
        fontSize={"16px"}
        fontStyle={"normal"}
        fontWeight={"400"}
        lineHeight={"150%"}
      >
        We are committed to providing you with the best help possible, so we
        welcome your comments. Please fill out this questionnaire. Thank you!
      </Text>
      <Divider width={"277.906px"} height={"1.011px"} background={"rgba(0, 0, 0, 0.20)"} marginBottom={"30px"}/>
        <FormControl display="none">
          <Input name="courteous" value={String(surveyData.courteous)} readOnly />
          <Input name="informative" value={String(surveyData.informative)} readOnly />
          <Input name="prompt_and_helpful" value={String(surveyData.prompt_and_helpful)} readOnly />
          <Input name="lifeskill" value={String(surveyData.lifeskills)} readOnly />
          <Input name="recommend" value={String(surveyData.recommend)} readOnly />
          {qualityQuestionNames.map((name) => (
            <Input
              key={name}
              name={name}
              value={String(surveyData[name as keyof SurveyData] ?? "")}
              readOnly
            />
          ))}
        </FormControl>
        <OrderedList style={{ fontSize: "18px", fontWeight: "600", marginBottom: "130px"}} spacing={"4"}>
          <ListItem marginBottom={"50px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"14px"}
            >
              Please rate the quality of your experience in each category
            </Heading>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th></Th>
                    {["Very Poor", "Poor", "Neutral", "Good", "Excellent"].map((label) => (
                      <Th 
                        key={label} 
                        textAlign={"center"}
                        fontSize={"12px"}
                        color={"#808080"}
                        fontStyle={"normal"}
                        fontWeight={"400"}
                        lineHeight={"normal"}
                        padding={"4px"}
                        >
                        {label}
                      </Th>
                    ))}
                </Tr>
              </Thead>
              <Tbody>
                {qualityQuestions.map((question, qIdx) => (
                    <Tr key={qIdx}>
                      <Td
                        width={"200px"}
                        color={"#000"}
                        fontSize={"12px"}
                        fontStyle={"normal"}
                        fontWeight={"400"}
                        lineHeight={"150%"}
                      >
                        {question}
                      </Td>
                      {["1", "2", "3", "4", "5"].map((value) => (
                        <Td key={value} textAlign="center">
                            <Radio
                              name={qualityQuestionNames[qIdx]}
                              value={value}
                              isChecked={String(surveyData[qualityQuestionNames[qIdx] as keyof SurveyData]) === value}
                              onChange={() =>
                                setSurveyData((prev) => ({
                                  ...prev,
                                  [qualityQuestionNames[qIdx] as keyof SurveyData]: Number(value),
                                }))
                              }
                              sx={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                border: "2px solid",
                                borderColor: "gray.300",
                                background: String(surveyData[qualityQuestionNames[qIdx] as keyof SurveyData]) === value ? "blue.500" : "white",
                                _checked: {
                                  background: "blue.500",
                                  borderColor: "blue.500",
                                },
                                _hover: {
                                  borderColor: "gray.500",
                                },
                                _focus: {
                                  boxShadow: "none",
                                },
                              }}
                            />
                        </Td>
                      ))}
                    </Tr>
                ))}
              </Tbody>
            </Table>
            {errors.qualityQuestions && (
              <Text color="red.500" fontSize="sm" mt={2}>
                Please rate all 6 quality categories.
              </Text>
            )}
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"14px"}
            >
              Is your case manager...
            </Heading>
            <FormControl>
            <VStack
              align="start"
              spacing={"14px"}
            >
                <Text
                  color={"#000"}
                  textAlign={"center"}
                  fontSize={"16px"}
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"normal"}
                >
                  Courteous?
                </Text>
                <HStack spacing={4}>
                  {["yes", "no"].map((option) => (
                    <Button
                      key={option}
                      onClick={() =>
                        setSurveyData((prev) => ({
                          ...prev,
                          courteous: option === "yes",
                        }))
                      }
                      variant="outline"
                      width={"89px"}
                      height={"28px"}
                      borderColor={surveyData.courteous === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                      borderRadius={"6.985px"}
                      color={surveyData.courteous === (option === "yes") ? "white" : "black"}
                      textAlign={"center"}
                      fontSize={"10.588px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      bg={surveyData.courteous === (option === "yes") ? "blue.500" : "transparent"}
                      _hover={{
                        bg: surveyData.courteous === (option === "yes") ? "blue.600" : "gray.100",
                      }}
                      px={6}
                      py={2}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </HStack>
                {errors.courteous && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Please answer if your case manager was courteous.
                  </Text>
                )}
                <Text
                  color={"#000"}
                  textAlign={"center"}
                  fontSize={"16px"}
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"normal"}
                >Informative?
                </Text>
                <HStack spacing={4}>
                  {["yes", "no"].map((option) => (
                    <Button
                      key={option}
                      onClick={() =>
                        setSurveyData((prev) => ({
                          ...prev,
                          informative: option === "yes",
                        }))
                      }
                      variant="outline"
                      width={"89px"}
                      height={"28px"}
                      borderColor={surveyData.informative === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                      borderRadius={"6.985px"}
                      color={surveyData.informative === (option === "yes") ? "white" : "black"}
                      textAlign={"center"}
                      fontSize={"10.588px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      bg={surveyData.informative === (option === "yes") ? "blue.500" : "transparent"}
                      _hover={{
                        bg: surveyData.informative === (option === "yes") ? "blue.600" : "gray.100",
                      }}
                      px={6}
                      py={2}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </HStack>
                {errors.informative && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Please answer if your case manager was informative.
                  </Text>
                )}
                <Text
                  color={"#000"}
                  textAlign={"center"}
                  fontSize={"16px"}
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"normal"}
                >
                  Prompt and helpful?
                </Text>
                <HStack spacing={4}>
                  {["yes", "no"].map((option) => (
                    <Button
                      key={option}
                      onClick={() =>
                        setSurveyData((prev) => ({
                          ...prev,
                          prompt_and_helpful: option === "yes",
                        }))
                      }
                      variant="outline"
                      width={"89px"}
                      height={"28px"}
                      borderColor={surveyData.prompt_and_helpful === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                      borderRadius={"6.985px"}
                      color={surveyData.prompt_and_helpful === (option === "yes") ? "white" : "black"}
                      textAlign={"center"}
                      fontSize={"10.588px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      bg={surveyData.prompt_and_helpful === (option === "yes") ? "blue.500" : "transparent"}
                      _hover={{
                        bg: surveyData.prompt_and_helpful === (option === "yes") ? "blue.600" : "gray.100",
                      }}
                      px={6}
                      py={2}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </HStack>
                {errors.prompt_and_helpful && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Please answer if your case manager was prompt and helpful.
                  </Text>
                )}
            </VStack>
          </FormControl>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"14px"}
            >
              How frequently do you have case meetings?
            </Heading>
            <FormControl>
              <RadioGroup 
                name="case_meeting_frequency"
                value={surveyData.case_meeting_frequency}
                onChange={(val) =>
                  setSurveyData((prev) => ({
                    ...prev,
                    case_meeting_frequency: val,
                  }))
                }
              >
                <HStack spacing={10}>
                  {["never", "rarely", "occasionally", "often", "always"].map((option) => (
                    <VStack key={option}>
                      <Text
                        color="var(--gray-600, #4A5568)"
                        fontSize="12px"
                        fontStyle="normal"
                        fontWeight="400"
                        lineHeight="normal"
                        marginBottom="19px"
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                      <Radio
                        value={option}
                        sx={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: "2px solid",
                          borderColor: "gray.300",
                          _checked: {
                            background: "blue.500",
                            borderColor: "blue.500",
                          },
                          _hover: {
                            borderColor: "gray.500",
                          },
                          _focus: {
                            boxShadow: "none",
                          },
                        }}
                      />
                    </VStack>
                  ))}
                  {/* <VStack>
                    <Text
                      color={"var(--gray-600, #4A5568)"}
                      fontFamily={"Inter"}
                      fontSize={"12px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      marginBottom={"19px"}
                    >
                      Never
                    </Text>
                    <Radio 
                      value="never"
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "2px solid",
                        borderColor: "gray.300",
                        _checked: {
                          background: "blue.500",
                          borderColor: "blue.500",
                        },
                        _hover: {
                          borderColor: "gray.500",
                        },
                        _focus: {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </VStack> */}
                  {/* <VStack>
                    <Text
                      color={"var(--gray-600, #4A5568)"}
                      fontFamily={"Inter"}
                      fontSize={"12px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      marginBottom={"19px"}
                    >
                      Rarely
                    </Text>
                    <Radio 
                      value="rarely"
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "2px solid",
                        borderColor: "gray.300",
                        _checked: {
                          background: "blue.500",
                          borderColor: "blue.500",
                        },
                        _hover: {
                          borderColor: "gray.500",
                        },
                        _focus: {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </VStack>
                  <VStack>
                    <Text
                      color={"var(--gray-600, #4A5568)"}
                      fontFamily={"Inter"}
                      fontSize={"12px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      marginBottom={"19px"}
                    >
                      Occasionally
                    </Text>
                    <Radio 
                      value="occasionally"
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "2px solid",
                        borderColor: "gray.300",
                        _checked: {
                          background: "blue.500",
                          borderColor: "blue.500",
                        },
                        _hover: {
                          borderColor: "gray.500",
                        },
                        _focus: {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </VStack>
                  <VStack>
                    <Text
                      color={"var(--gray-600, #4A5568)"}
                      fontFamily={"Inter"}
                      fontSize={"12px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      marginBottom={"19px"}
                    >
                      Often
                    </Text>
                    <Radio 
                      value="often"
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "2px solid",
                        borderColor: "gray.300",
                        _checked: {
                          background: "blue.500",
                          borderColor: "blue.500",
                        },
                        _hover: {
                          borderColor: "gray.500",
                        },
                        _focus: {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </VStack>
                  <VStack>
                    <Text
                      color={"var(--gray-600, #4A5568)"}
                      fontFamily={"Inter"}
                      fontSize={"12px"}
                      fontStyle={"normal"}
                      fontWeight={"400"}
                      lineHeight={"normal"}
                      marginBottom={"19px"}
                    >
                      Always
                    </Text>
                    <Radio 
                      value="always"
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "2px solid",
                        borderColor: "gray.300",
                        _checked: {
                          background: "blue.500",
                          borderColor: "blue.500",
                        },
                        _hover: {
                          borderColor: "gray.500",
                        },
                        _focus: {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </VStack> */}
                </HStack>
              </RadioGroup>
              {errors.case_meeting_frequency && (
                <Text color="red.500" fontSize="sm" mt={2}>
                  Please select how frequently you meet with your case manager.
                </Text>
              )}
            </FormControl>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              Were the Lifeskills classes beneficial to you?
            </Heading>
            <HStack spacing={4}>
                {["yes", "no"].map((option) => (
                  <Button
                    key={option}
                    onClick={() =>
                      setSurveyData((prev) => ({
                        ...prev,
                        lifeskills: option === "yes",
                      }))
                    }
                    variant="outline"
                    width={"89px"}
                    height={"28px"}
                    borderColor={surveyData.lifeskills === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                    borderRadius={"6.985px"}
                    color={surveyData.lifeskills === (option === "yes") ? "white" : "black"}
                    textAlign={"center"}
                    fontSize={"10.588px"}
                    fontStyle={"normal"}
                    fontWeight={"400"}
                    lineHeight={"normal"}
                    bg={surveyData.lifeskills === (option === "yes") ? "blue.500" : "transparent"}
                    _hover={{
                      bg: surveyData.lifeskills === (option === "yes") ? "blue.600" : "gray.100",
                    }}
                    px={6}
                    py={2}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </HStack>
              {errors.lifeskills && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  Please answer whether Lifeskills classes were beneficial.
                </Text>
              )}
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              Would you recommend CCH to a friend?
            </Heading>
            <HStack spacing={4} marginBottom={"30px"}>
              {["yes", "no"].map((option) => (
                <Button
                  key={option}
                  onClick={() =>
                    setSurveyData((prev) => ({
                      ...prev,
                      recommend: option === "yes",
                    }))
                  }
                  variant="outline"
                  width={"89px"}
                  height={"28px"}
                  borderColor={surveyData.recommend === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                  borderRadius={"6.985px"}
                  color={surveyData.recommend === (option === "yes") ? "white" : "black"}
                  textAlign={"center"}
                  fontSize={"10.588px"}
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"normal"}
                  bg={surveyData.recommend === (option === "yes") ? "blue.500" : "transparent"}
                  _hover={{
                    bg: surveyData.recommend === (option === "yes") ? "blue.600" : "gray.100",
                  }}
                  px={6}
                  py={2}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </HStack>
            {errors.recommend && (
              <Text color="red.500" fontSize="sm" mt={1}>
                Please indicate if you would recommend CCH.
              </Text>
            )}
            <Box pl={6} mt={2}>
              <Heading
                color={"#000"}
                fontSize={"16px"}
                fontStyle={"normal"}
                fontWeight={"400"}
                lineHeight={"150%"}
                marginBottom={"14px"}
              >
                <Text as="span" fontSize="18px" fontWeight="600" mr={1}>
                  5a.
                </Text>
                Why or why not?
              </Heading>
              <FormControl>
                <Textarea
                  name="recommend_reasoning"
                  onChange={(e) =>
                    setSurveyData((prev) => ({
                      ...prev,
                      recommend_reasoning: e.target.value,
                    }))
                  }
                  value={surveyData.recommend_reasoning}
                  resize={"none"}
                  fontSize={"16px"}
                  borderRadius={"14px"}
                  borderColor={"blue.solid var(--gray-600, #4A5568)"}
                />
                {errors.recommend_reasoning && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    Please explain your recommendation.
                  </Text>
                )}
              </FormControl>
            </Box>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              If you entered our program because of a referral, how might we
              have made CCH more helpful?
            </Heading>
            <FormControl>
            <Textarea
              name="make_cch_more_helpful"
              value={surveyData.make_cch_more_helpful}
              onChange={(e) =>
                setSurveyData((prev) => ({
                  ...prev,
                  make_cch_more_helpful: e.target.value,
                }))
              }
              borderRadius={"14px"}
              fontSize={"16px"}
              borderColor={"blue.solid var(--gray-600, #4A5568)"}
              resize={"none"}
            />
          </FormControl>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              Who is your case manager?
            </Heading>
            <FormControl>
              <Select
                name="cm_id"
                placeholder="Select your case manager"
                value={surveyData.cm_id}
                onChange={(e) =>
                  setSurveyData((prev) => ({
                    ...prev,
                    cm_id: Number(e.target.value),
                  }))
                }
                borderRadius={"14px"}
                borderColor={"blue.solid var(--gray-600, #4A5568)"}
              >
                {caseManagers.map((manager: CaseManager) => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.firstName} {manager.lastName}
                  </option>
                ))}
              </Select>
               {errors.cm_id && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  Please select your case manager.
                </Text>
              )}
            </FormControl>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              Is there any feedback you want your case manager to know?
            </Heading>
            <FormControl>
              <Textarea
                name="cm_feedback"
                value={surveyData.cm_feedback}
                onChange={(e) =>
                  setSurveyData((prev) => ({
                    ...prev,
                    cm_feedback: e.target.value,
                  }))
                }
                borderRadius={"14px"}
                fontSize={"16px"}
                borderColor={"blue.solid var(--gray-600, #4A5568)"}
                resize={"none"}
              />
            </FormControl>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              Please share any additional comments or suggestions.
            </Heading>
            <FormControl>
              <Textarea
                name="other_comments"
                value={surveyData.other_comments}
                onChange={(e) =>
                  setSurveyData((prev) => ({
                    ...prev,
                    other_comments: e.target.value,
                  }))
                }
                borderRadius={"14px"}
                fontSize={"16px"}
                borderColor={"blue.solid var(--gray-600, #4A5568)"}
                resize={"none"}
              />
            </FormControl>
          </ListItem>
          <ListItem marginBottom={"30px"}>
            <Heading
              color={"#000"}
              fontSize={"16px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"150%"}
              marginBottom={"30px"}
            >
              Date of Program Completion
            </Heading>
            <FormControl>
              <Input
                name="date"
                type="date"
                placeholder="Date"
                value={
                  typeof surveyData.date === "string"
                    ? surveyData.date
                    : surveyData.date.toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setSurveyData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                borderRadius={"14px"}
                borderColor={"blue.solid var(--gray-600, #4A5568)"}
              />
              {errors.date && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  Please select your program completion date.
                </Text>
              )}
            </FormControl>
          </ListItem>
        </OrderedList>
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Button
            onClick={handleValidateAndNext}
            color={"white"}
            backgroundColor={"blue.500"}
            fontSize={"20px"}
            borderRadius={"6px"}
            width={"150px"}
            height={"50px"}
          >
            Review
          </Button>
        </Box>
      {/* </form> */}
    </VStack>
  );
};
