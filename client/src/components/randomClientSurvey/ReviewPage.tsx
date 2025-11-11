import { 
    Box, 
    Button, 
    Circle, 
    Divider, 
    FormControl, 
    Heading, 
    HStack, 
    Input, 
    ListItem, 
    OrderedList, 
    Radio, 
    RadioGroup, 
    Select, 
    Table, 
    Tbody, 
    Td, 
    Text, 
    Textarea, 
    Th, 
    Thead, 
    Tr, 
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    useDisclosure,
} from "@chakra-ui/react";

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
  "overall_experience"
];

type CaseManager = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
};

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


type ReviewPageProps = {
  surveyData: SurveyData;
  caseManagers: CaseManager[];
  onSubmit: () => void;
  onCancel: () => void;
};

export const ReviewPage = ({ surveyData, caseManagers, onSubmit, onCancel }: ReviewPageProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
    <VStack
        width={"100%"}
        height={"100%"}
        backgroundColor={"#E7F0F4"}
    >
        <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            padding={"30px"}
        >
            <Box
            width={"200px"}
            position={"relative"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            >
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
                backgroundColor={"blue.500"}
                border="1px"
                borderColor={"blue.500"}
                color={"white"}
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
        <VStack
            sx={{ width: 700, height: "1100px", overflowY: "auto", padding: "60px"}}
            alignItems={"start"}
            backgroundColor={"#FFF"}
            borderRadius={"16px"}
            marginBottom={"70px"}
        >
        <Heading
            color={"#3182CE"}
            textAlign={"center"}
            fontSize={"24.405px"}
            fontStyle={"normal"}
            fontWeight={"400"}
            lineHeight={"150%"}
            marginTop={"30px"}
        >
            How are we doing?
        </Heading>
        <Text
            color={"#656464"}
            fontSize={"13.016px"}
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
            {qualityQuestionNames.map((name, index) => (
                <Input
                    key={index}
                    name={name}
                    value={String(surveyData[name as keyof SurveyData] ?? "")}
                    readOnly
                />
            ))}
            </FormControl>
            <OrderedList style={{ fontSize: "14px", fontWeight: "600"}} spacing={"4"}>
            <ListItem marginBottom={"50px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
                fontStyle={"normal"}
                fontWeight={"400"}
                lineHeight={"150%"}
                marginBottom={"16px"}
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
                            fontSize={"9.762px"}
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
                            width={"180px"}
                            color={"#000"}
                            fontSize={"9.762px"}
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
                                isChecked={String(surveyData[qualityQuestionNames[qIdx] as keyof SurveyData] ?? "") === value}
                                isDisabled
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "6px",
                                    border: "2px solid",
                                    borderColor: "gray.300",
                                    background: String(surveyData[qualityQuestionNames[qIdx] as keyof SurveyData] ?? "") === value ? "blue.500" : "white",
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
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
                fontStyle={"normal"}
                fontWeight={"400"}
                lineHeight={"150%"}
                marginBottom={"16px"}
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
                    fontSize={"12.331px"}
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
                        variant="outline"
                        width={"72px"}
                        height={"22px"}
                        borderColor={surveyData.courteous === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                        borderRadius={"6.985px"}
                        color={surveyData.courteous === (option === "yes") ? "white" : "black"}
                        textAlign={"center"}
                        fontSize={"8.613px"}
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
                    <Text
                    color={"#000"}
                    textAlign={"center"}
                    fontSize={"12.331px"}
                    fontStyle={"normal"}
                    fontWeight={"400"}
                    lineHeight={"normal"}
                    >Informative?
                    </Text>
                    <HStack spacing={4}>
                    {["yes", "no"].map((option) => (
                        <Button
                        key={option}
                        variant="outline"
                        width={"72px"}
                        height={"22px"}
                        borderColor={surveyData.informative === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                        borderRadius={"6.985px"}
                        color={surveyData.informative === (option === "yes") ? "white" : "black"}
                        textAlign={"center"}
                        fontSize={"8.613px"}
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
                    <Text
                    color={"#000"}
                    textAlign={"center"}
                    fontSize={"12.331px"}
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
                        variant="outline"
                        width={"72px"}
                        height={"22px"}
                        borderColor={surveyData.prompt_and_helpful === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                        borderRadius={"6.985px"}
                        color={surveyData.prompt_and_helpful === (option === "yes") ? "white" : "black"}
                        textAlign={"center"}
                        fontSize={"8.613px"}
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
                </VStack>
            </FormControl>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
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
                >
                    <HStack spacing={10}>
                    {["never", "rarely", "occasionally", "often", "always"].map((option) => (
                        <VStack key={option}>
                        <Text
                            color="var(--gray-600, #4A5568)"
                            fontSize="9.762px"
                            fontStyle="normal"
                            fontWeight="400"
                            lineHeight="normal"
                            marginBottom="15px"
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                        <Radio
                            value={option}
                            sx={{
                            width: "20px",
                            height: "20px",
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
                    </HStack>
                </RadioGroup>
                </FormControl>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
                fontStyle={"normal"}
                fontWeight={"400"}
                lineHeight={"150%"}
                marginBottom={"16px"}
                >
                Were the Lifeskills classes beneficial to you?
                </Heading>
                <HStack spacing={4}>
                    {["yes", "no"].map((option) => (
                    <Button
                        key={option}
                        variant="outline"
                        width={"72px"}
                        height={"22px"}
                        borderColor={surveyData.lifeskills === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                        borderRadius={"6.985px"}
                        color={surveyData.lifeskills === (option === "yes") ? "white" : "black"}
                        textAlign={"center"}
                        fontSize={"8.613px"}
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
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
                fontStyle={"normal"}
                fontWeight={"400"}
                lineHeight={"150%"}
                marginBottom={"16px"}
                >
                Would you recommend CCH to a friend?
                </Heading>
                <HStack spacing={4} marginBottom={"30px"}>
                {["yes", "no"].map((option) => (
                    <Button
                    key={option}
                    variant="outline"
                    width={"72px"}
                    height={"22px"}
                    borderColor={surveyData.recommend === (option === "yes") ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                    borderRadius={"6.985px"}
                    color={surveyData.recommend === (option === "yes") ? "white" : "black"}
                    textAlign={"center"}
                    fontSize={"8.613px"}
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
                <Box pl={6} mt={2}>
                <Heading
                    color={"#000"}
                    fontSize={"13px"}
                    fontStyle={"normal"}
                    fontWeight={"400"}
                    lineHeight={"150%"}
                    marginBottom={"14px"}
                >
                    <Text as="span" fontSize="14px" fontWeight="600" mr={1}>
                    5a.
                    </Text>
                    Why or why not?
                </Heading>
                <FormControl>
                    <Textarea
                    name="recommend_reasoning"
                    value={surveyData.recommend_reasoning}
                    resize={"none"}
                    borderRadius={"14px"}
                    fontSize={"13px"}
                    borderColor={"blue.solid var(--gray-600, #4A5568)"}
                    />
                </FormControl>
                </Box>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
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
                fontSize={"13px"}
                borderRadius={"14px"}
                borderColor={"blue.solid var(--gray-600, #4A5568)"}
                resize={"none"}
                />
            </FormControl>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
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
                    fontSize={"13px"}
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
                </FormControl>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
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
                    fontSize={"13px"}
                    borderRadius={"14px"}
                    borderColor={"blue.solid var(--gray-600, #4A5568)"}
                    resize={"none"}
                />
                </FormControl>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
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
                    fontSize={"13px"}
                    borderRadius={"14px"}
                    borderColor={"blue.solid var(--gray-600, #4A5568)"}
                    resize={"none"}
                />
                </FormControl>
            </ListItem>
            <ListItem marginBottom={"30px"}>
                <Heading
                color={"#000"}
                fontSize={"13px"}
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
                    fontSize={"13px"}
                    value={surveyData.date instanceof Date ? surveyData.date.toISOString().slice(0, 10) : String(surveyData.date)}
                    borderRadius={"14px"}
                    borderColor={"blue.solid var(--gray-600, #4A5568)"}
                />
                </FormControl>
            </ListItem>
            </OrderedList>
        </VStack>
        <HStack
            width={"750px"}
            justifyContent={"space-between"}
            marginBottom={"40px"}
        >
            <Button
            onClick={onOpen}
            color={"white"}
            backgroundColor={"var(--blackAlpha-600, rgba(0, 0, 0, 0.48))"}
            fontSize={"20px"}
            borderRadius={"6px"}
            width={"150px"}
            height={"50px"}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            color={"white"}
            backgroundColor={"blue.500"}
            borderRadius={"6px"}
            fontSize={"20px"}
            width={"150px"}
            height={"50px"}
          >
            Submit
          </Button>
        </HStack>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
            minWidth={'388px'}
            minHeight={'267px'}
            padding={"48px"}
        >
            <ModalBody
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                <Heading
                    color={"#000"}
                    fontSize={"18px"}
                    fontStyle={"normal"}
                    fontWeight={"600"}
                    lineHeight={"28px"}
                >
                    Are you sure you want to cancel?
                </Heading>
                <Text
                    color={"#000"}
                    fontSize={"14px"}
                    fontStyle={"normal"}
                    fontWeight={"400"}
                    lineHeight={"150%"}
                >
                    You will be led back to the form to edit
                </Text>
                </Box>
            </ModalBody>
            <ModalFooter
                display={"flex"}
                gap={"10px"}
                justifyContent={"center"}
            >
            <Button
                variant="ghost"
                onClick={onClose}
                backgroundColor={"var(--blackAlpha-600, rgba(0, 0, 0, 0.48))"}
                borderRadius={"6px"}
                color={"#FFF"}
                fontSize={"18px"}
                fontStyle={"normal"}
                fontWeight={"600"}
                lineHeight={"28px"}
                width={"154px"}
                height={"48px"}
            >
                No
            </Button>
            <Button
                backgroundColor={"var(--blue-500, #3182CE)"}
                borderRadius={"6px"}
                color={"#FFF"}
                fontSize={"18px"}
                fontStyle={"normal"}
                fontWeight={"600"}
                lineHeight={"28px"}
                width={"154px"}
                height={"48px"}
                onClick={() => {
                    onCancel();
                    onClose();
                }}
            >
                Yes
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </VStack>
  );
};