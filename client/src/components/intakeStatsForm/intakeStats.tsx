import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar";
import { FaArrowLeft } from "react-icons/fa";

import {
  Button,
  FormControl,
  FormLabel,
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
  Progress,
  Box
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { IntakeStatsPg1, IntakeStatsPg2 } from "./intakeStatsPgs";

const page1Columns: string[] = [
    "age",
    "caloptimaFunded",
    "caseManager",
    // "children", exclude since a valid value can be falsy
    "createdBy",
    "dateOfBirth",
    "disabled",
    "email",
    "emergencyContactName",
    "emergencyContactPhoneNumber",
    "entranceDate",
    "ethnicity",
    "firstName",
    "grant",
    "id",
    "lastName",
    "locationId",
    "medical",
    "month",
    // "numChildren", exclude since a valid value can be falsy
    "phoneNumber",
    "priorLiving"
  ];

const page2Columns: string[] = [
    "attendingSchoolUponEntry",
    "beenConvicted",
    "chronicallyHomeless",
    "cityOfLastPermanentResidence",
    "domesticeViolenceHistory",
    "employed",
    "employedUponEntry",
    "homelessnessLength",
    "lastEmployment",
    "lastSlept",
    "mentalHealth",
    "mentalHealthUndiagnosed",
    "photoReleaseSigned",
    "priorHomelessCity",
    "priorLivingCity",
    "shelterInLastFiveYears",
    "shelterLastFiveYears",
    "substanceHistory",
    "supportSystem", // check if this is yes, then check supportSystem
    "transportation"
];

const supportSystemColumns: string[] = [ 
    "childcareAssistance",
    "foodPurchase",
    "housing"
];

export const IntakeStats = () => {
    const navigate = useNavigate();
    const [pageNum, setPageNum] = useState(1);
    const [review, setReview] = useState(0);
    const [formData, setFormData] = useState({});

    const toast = useToast();

    const checkPage1Cols = () => {
        for (const item of page1Columns) {
            if (!formData[item]) {
                return false;
            }
        }
        return true;
    };

    const checkPage2Cols = () => {
        for (const item of page2Columns) {
            if (!formData[item]) {
                return false;
            }
        }
        if (formData.supportSystem === "Yes") {
            for (const item of supportSystemColumns) {
                if (!formData[item]) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleNext = () => {
        console.log(formData);
        // TODO: Uncomment for missing information toast
        // if (!checkPage1Cols()) {
        //     toast({
        //         title: 'Missing Information',
        //         description: "Please fill out all required information before submitting",
        //         status: 'warning',
        //         duration: 9000,
        //         isClosable: true,
        //     })
        //     return;
        // }
        setPageNum(2);
    }

    const handlePrev = () => {
        console.log(formData);
        setPageNum(1);
    }

    const handleReview = () => {
        console.log(formData);
        // TODO: Uncomment for missing information toast
        // if (!checkPage2Cols()) {
        //     toast({
        //         title: 'Missing Information',
        //         description: "Please fill out all required information before submitting",
        //         status: 'warning',
        //         duration: 9000,
        //         isClosable: true,
        //     })
        //     return;
        // }
        setReview(1);
    }

    const handlePrepareSubmit = () => { 
        // TODO: Uncomment for missing information toast
        // if (!checkPage1Cols() || !checkPage2Cols()) {
        //     toast({
        //         title: 'Missing Information',
        //         description: "Please fill out all required information before submitting",
        //         status: 'warning',
        //         duration: 9000,
        //         isClosable: true,
        //     })
        //     return;
        // }
        // TODO: Add function for submission of form, to be called by submit button in this toast
        toast({
            position: "top-right",
            isClosable: true,
            render: ({ onClose }) => (
                <Box
                p={4}
                bg="white"
                color="black"
                borderRadius="md"
                display="flex"
                flexDirection="column"
                alignItems="center"
                >
                    <Text fontSize="lg" color="black" fontWeight="bold">Warning!</Text>
                    <span>You will not be able to view or edit this form after submission.</span>
                    <HStack>
                        <Button
                            ml={4}
                            size="sm"
                            backgroundColor='#ffffff'
                            color='#4398cd'
                            border="2px solid #4398cd"
                            onClick={() => {
                            console.log("Button inside toast clicked");
                            onClose();
                            }}
                        >
                            Continue Reviewing
                        </Button>
                        <Button
                            ml={4}
                            size="sm"
                            backgroundColor='#4398cd'
                            color='#ffffff'
                            onClick={() => {
                            console.log("Button inside toast clicked");
                            onClose();
                            }}
                        >
                            Submit
                        </Button>
                    </HStack>
                </Box>
            ),
        })
    }

    return(
    <Box backgroundColor="#EDF2F7" minHeight="100vh" width="100%">
        <Navbar />
        <Box justifyContent="flex-start" px={5}>
            <Button onClick={() => navigate("/forms-table")}>
                <FaArrowLeft color="#4398cd"/>
                <Text color="#4398cd" mb={0}>Back</Text>
            </Button>
        </Box>
        { review === 0 ?
            <Box backgroundColor = "#FFFFFF" margin="0 8% 3% 8%" borderRadius="md" maxHeight="85vh" overflow="auto">
                <Box display="flex" justifyContent="center" alignItems="center" pt="6vh">
                    <HStack w="65%" justify="center" align="center" spacing={4}>
                        <Text fontSize="sm" whiteSpace="nowrap">Page {pageNum} of 2</Text>
                        <Progress color='#4398cd' value={100} w="100%" borderTopLeftRadius="full" borderBottomLeftRadius="full"/>
                        <Progress color='#4398cd' value={pageNum === 1 ? 0 : 100} w="100%" borderTopRightRadius="full" borderBottomRightRadius="full"/>
                    </HStack>
                </Box>
                <Heading marginTop={4} textAlign="center">Intake Statistical Form</Heading>
                <Box pt={10} mt={4}>
                    {pageNum === 1 ? 
                        <Box>
                            <IntakeStatsPg1 formData={formData} setFormData={setFormData}/>
                            <HStack justifyContent="flex-end" width="100%" px={10} mt={4} mb={3}>
                                <Button backgroundColor='#4398cd' color='#ffffff' onClick={() => handleNext(formData)}>Next</Button>
                            </HStack>
                        </Box>
                        :
                        <Box>
                            <IntakeStatsPg2 formData={formData} setFormData={setFormData}/>
                            <HStack justifyContent="space-between" width="100%" px={10} mt={4} mb={3}>
                                <Button border="2px solid #4398cd"  backgroundColor ='#ffffff' color='#4398cd' onClick={handlePrev}>Last Page</Button>
                                <Button backgroundColor='#4398cd' color='#ffffff' onClick={handleReview}>Review</Button>
                            </HStack>
                        </Box>
                    }
                </Box>
            </Box>
            :
            <>
                <Box backgroundColor = "#FFFFFF" margin="0 8% 3% 8%" borderRadius="md" maxHeight="85vh" overflow="auto">
                    <Box display="flex" justifyContent="center" alignItems="center" pt="6vh">
                        <HStack w="50%" justify="center" align="center" spacing={4}>
                            <Text fontSize="sm" whiteSpace="nowrap">Page 1 of 2</Text>
                            <Progress color='#4398cd' value={100} w="100%" borderRadius="full"/>
                            <Progress color='#4398cd' value={0} w="100%" borderRadius="full"/>
                        </HStack>
                    </Box>
                    <Heading marginTop={4} textAlign="center">Intake Statistical Form</Heading>
                    <Box pt={10} mt={4}>
                        <Box>
                            <IntakeStatsPg1 formData={formData} setFormData={setFormData}/>
                        </Box>
                    </Box>
                </Box>

                <Box backgroundColor = "#FFFFFF" margin="0 8% 1% 8%" borderRadius="md" maxHeight="85vh" overflow="auto">
                    <Box display="flex" justifyContent="center" alignItems="center" pt="6vh">
                        <HStack w="50%" justify="center" align="center" spacing={4}>
                            <Text fontSize="sm" whiteSpace="nowrap">Page 2 of 2</Text>
                            <Progress color='#4398cd' value={100} w="100%" borderRadius="full"/>
                            <Progress color='#4398cd' value={100} w="100%" borderRadius="full"/>
                        </HStack>
                    </Box>
                    <Heading marginTop={4} textAlign="center">Intake Statistical Form</Heading>
                    <Box pt={10} mt={4}>
                        <Box>
                            <IntakeStatsPg2 formData={formData} setFormData={setFormData}/>
                        </Box>
                    </Box>
                </Box>
                <Box width="100%" pb="20px" display="flex">
                    <HStack justifyContent="flex-end" width="100%">
                        <Button backgroundColor='#4398cd' color='#ffffff' mr="5%" onClick={handlePrepareSubmit}>Submit</Button>
                    </HStack>
                </Box>
            </>
        }
    </Box>
    );
};