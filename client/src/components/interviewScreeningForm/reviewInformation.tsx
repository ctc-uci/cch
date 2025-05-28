import { useNavigate } from "react-router-dom";
import { useForm } from '../../contexts/formContext';
import StepperComponent from "./stepperComponent";
import { Button, Box, IconButton, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import PersonalInformation from "./PersonalInformation";
import FinancialInformation from "./financialInformation";
import HealthSocialInformation from "./healthSocialInformation";
import AdditionalInformation from "./additionalInformation";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRef } from "react";

const ReviewInformation: React.FC = () => {
    const { formData } = useForm();
    const navigate = useNavigate();
    const { backend } = useBackendContext();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleSubmit = async () => {
      formData.name = formData.firstName + " " + formData.lastName;
      formData.educationHistory = formData.educationHistory + " " + formData.dateOfEducation;
    //   formData.medical = formData.medical + ": " + formData.medicalConditions;
      formData.monthlyBills = formData.monthlyBills + ": " + formData.estimateAmountBills;

      try{
        const response = await backend.post("/", {
          body: JSON.stringify(formData),
        });
        if(response.status === 200){
          navigate("/success");
        }

      }catch(err){
        alert("Submission failed. Try again. " + err.message);
      }

    };

    return (
        <Box p="20px" bg="#E7F0F4" padding="30">
            <Box position="relative">
                <IconButton
                    aria-label="Back to additional"
                    icon={<ChevronLeftIcon boxSize={8} />}
                    onClick={() => navigate("/additional")}
                    colorScheme="blue"
                    variant="ghost"
                    size="lg"
                    position="absolute"
                    left={0}
                    top={0}
                />
                <Box maxW="75%" mx="auto" px={4}>
                    <StepperComponent step_index={5} />
                </Box>
            </Box>
            <Box as="h2" fontSize="28px" color="blue.500" pt="10px">Review Your Information</Box>
            
            <Box position="relative" mb={5}>
                <IconButton
                    aria-label="Scroll left"
                    icon={<ChevronLeftIcon boxSize={8} />}
                    onClick={() => handleScroll('left')}
                    colorScheme="blue"
                    position="absolute"
                    left={5}
                    top="50%"
                    transform="translateY(-33%)"
                    zIndex={10}
                    boxShadow="lg"
                    rounded="full"
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: "blue.600" }}
                    size="lg"
                />
                <IconButton
                    aria-label="Scroll right"
                    icon={<ChevronRightIcon boxSize={8} />}
                    onClick={() => handleScroll('right')}
                    colorScheme="blue"
                    position="absolute"
                    right={5}
                    top="50%"
                    transform="translateY(-25%)"
                    zIndex={10}
                    boxShadow="lg"
                    rounded="full"
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: "blue.600" }}
                    size="lg"
                />
                <Flex
                    ref={scrollContainerRef}
                    gap="20px"
                    px="40px"
                    py="20px"
                    overflowX="auto"
                    position="relative"
                    sx={{
                        scrollBehavior: "smooth",
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                        "&::-webkit-scrollbar": {
                            display: "none"
                        }
                    }}
                >
                    <Box
                        outline="5px"
                        outlineColor="black"
                        bg="white"
                        p="15px"
                        borderRadius="15px"
                        minW="82vw"
                        flex="0 0 auto"
                        sx={{
                            scrollSnapAlign: "center",
                            scrollSnapStop: "always"
                        }}
                    >
                        <PersonalInformation hidden={true}/>
                    </Box>
                    <Box
                        outline="5px"
                        outlineColor="black"
                        bg="white"
                        p="15px"
                        borderRadius="15px"
                        minW="82vw"
                        flex="0 0 auto"
                        sx={{
                            scrollSnapAlign: "center",
                            scrollSnapStop: "always"
                        }}
                    >
                        <FinancialInformation hidden={true}/>
                    </Box>
                    <Box
                        outline="5px"
                        outlineColor="black"
                        bg="white"
                        p="15px"
                        borderRadius="15px"
                        minW="82vw"
                        flex="0 0 auto"
                        sx={{
                            scrollSnapAlign: "center",
                            scrollSnapStop: "always"
                        }}
                    >
                        <HealthSocialInformation hidden={true}/>
                    </Box>
                    <Box
                        outline="5px"
                        outlineColor="black"
                        bg="white"
                        p="15px"
                        borderRadius="15px"
                        minW="82vw"
                        flex="0 0 auto"
                        sx={{
                            scrollSnapAlign: "center",
                            scrollSnapStop: "always"
                        }}
                    >
                        <AdditionalInformation hidden={true}/>
                    </Box>
                </Flex>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={5} pr={5}>
                <Button colorScheme="blue" onClick={handleSubmit} size="lg">Submit</Button>
            </Box>
        </Box>
    );
};

export default ReviewInformation;
