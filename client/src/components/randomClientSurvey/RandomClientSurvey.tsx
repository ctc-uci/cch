import {
    VStack,
    Text,
    Heading,
    HStack,
    Radio,
    FormLabel,
    FormControl,
    RadioGroup,
    Textarea,
    Button,
    useToast,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";


export const RandomClientSurvey = () => {
    const { backend } = useBackendContext();
    const toast = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
      
        const data = Object.fromEntries(formData);

        const currentDate = new Date().toISOString();
        
        const surveyData = {
            cch_qos: Number(data.cch_qos),
            date: currentDate,
            cm_qos: Number(data.cm_qos),
            courteous: data.courteous === "yes",
            informative: data.informative === "yes",
            prompt_and_helpful: data.prompt_and_helpful === "yes",
            entry_quality: Number(data.entry_quality),
            unit_quality: Number(data.unit_quality),
            clean: Number(data.clean),
            overall_experience: Number(data.overall_experience),
            case_meeting_frequency: data.case_meeting_frequency,
            lifeskills: data.lifeskill === "yes",
            recommend: data.recommend === "yes",
            recommend_reasoning: data.recommend_reasoning,
            make_cch_more_helpful: data.make_cch_more_helpful,
            cm_id: 123,
            cm_feedback: data.cm_feedback,
            other_comments: data.other_comments,
        };

        try {
            const response = await backend.post("/randomSurvey", surveyData);
            console.log(surveyData);
        }

        catch (error){
            toast({
                title: "An error occurred",
                description: `Random survey response was not created: ${error.message}`,
                status: "error",
            });
        }
        
    }

    return (
        <VStack spacing={5} sx={{ width: 800, marginX: "auto", padding: "20px"}}>
            <Heading textAlign={"center"}>Colette’s Children’s Home <br />Random Client Survey</Heading>
            <Text style={{ fontWeight: 'bold',color: 'blue'}}>How are we doing?</Text>
            <Text style={{ fontWeight: 'bold'}}>We are committed to providing you with the best help
            possible, so we welcome your comments. Please fill out
            this questionnaire. Thank you.</Text>
            <form style={{ width: '100%'}} onSubmit={handleSubmit}>
                <VStack spacing={6}>
                <FormControl isRequired>
                    <FormLabel>Please rate the quality of the service in the CCH program.</FormLabel>
                    <RadioGroup name="cch_qos">
                        <HStack spacing={4}>
                            {[1, 2, 3, 4, 5].map((value) => (
                            <Radio key={value} value={`${value}`}>
                                {value}
                            </Radio>
                            ))}
                        </HStack>
                        <HStack justify="space-between" w="31%" mt={1} px={4}>
                            <Text fontSize="xs" color="gray.500" ml="-6%" >Disappointing</Text>
                            <Text fontSize="xs" color="gray.500">Helpful</Text>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Please rate the quality of the service you received
                    from your case manager.</FormLabel>
                    <RadioGroup name="cm_qos">
                        <HStack spacing={4}>
                            {[1, 2, 3, 4, 5].map((value) => (
                            <Radio key={value} value={`${value}`}>
                                {value}
                            </Radio>
                            ))}
                        </HStack>
                        <HStack justify="space-between" w="31%" mt={1} px={4}>
                            <Text fontSize="xs" color="gray.500" ml="-6%" >Disappointing</Text>
                            <Text fontSize="xs" color="gray.500">Helpful</Text>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Is your case manager...</FormLabel>
                    <VStack align="start" spacing={4}>
                        <HStack>
                        <Text>Courteous?</Text>
                        <RadioGroup name="courteous">
                            <HStack spacing={4}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                            </HStack>
                        </RadioGroup>
                        </HStack>

                        <HStack>
                        <Text>Informative?</Text>
                        <RadioGroup name="informative">
                            <HStack spacing={4}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                            </HStack>
                        </RadioGroup>
                        </HStack>

                        <HStack>
                        <Text>Prompt and helpful?</Text>
                        <RadioGroup name="prompt_and_helpful">
                            <HStack spacing={4}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                            </HStack>
                        </RadioGroup>
                        </HStack>
                    </VStack>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Please rate the quality of your entrance into the CCH
                    program.</FormLabel>
                    <RadioGroup name="entry_quality">
                        <HStack spacing={4}>
                            {[1, 2, 3, 4, 5].map((value) => (
                            <Radio key={value} value={`${value}`}>
                                {value}
                            </Radio>
                            ))}
                        </HStack>
                        <HStack justify="space-between" w="31%" mt={1} px={4}>
                            <Text fontSize="xs" color="gray.500" ml="-6%" >Disappointing</Text>
                            <Text fontSize="xs" color="gray.500">Helpful</Text>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Please rate the quality of your unit.</FormLabel>
                    <RadioGroup name="unit_quality">
                        <HStack spacing={4}>
                            {[1, 2, 3, 4, 5].map((value) => (
                            <Radio key={value} value={`${value}`}>
                                {value}
                            </Radio>
                            ))}
                        </HStack>
                        <HStack justify="space-between" w="31%" mt={1} px={4}>
                            <Text fontSize="xs" color="gray.500" ml="-6%" >Disappointing</Text>
                            <Text fontSize="xs" color="gray.500">Helpful</Text>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Is the SITE clean?</FormLabel>
                    <RadioGroup name="clean">
                        <HStack spacing={4}>
                            {[1, 2, 3, 4, 5].map((value) => (
                            <Radio key={value} value={`${value}`}>
                                {value}
                            </Radio>
                            ))}
                        </HStack>
                        <HStack justify="space-between" w="31%" mt={1} px={4}>
                            <Text fontSize="xs" color="gray.500" ml="-6%" >Disappointing</Text>
                            <Text fontSize="xs" color="gray.500">Helpful</Text>
                        </HStack>
                    </RadioGroup>
                </FormControl>
                
                <FormControl isRequired>
                    <FormLabel>Please rate your overall experience at CCH.</FormLabel>
                    <RadioGroup name="overall_experience">
                        <HStack spacing={4}>
                            {[1, 2, 3, 4, 5].map((value) => (
                            <Radio key={value} value={`${value}`}>
                                {value}
                            </Radio>
                            ))}
                        </HStack>
                        <HStack justify="space-between" w="31%" mt={1} px={4}>
                            <Text fontSize="xs" color="gray.500" ml="-6%" >Disappointing</Text>
                            <Text fontSize="xs" color="gray.500">Helpful</Text>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>How frequently do you have case meetings?</FormLabel>
                    <RadioGroup name="case_meeting_frequency">
                        <HStack spacing={10}>
                            <Radio value="2-3_times_per_week">2-3 times per week</Radio>
                            <Radio value="1-2_times_per_month">1-2 times per month</Radio>
                        </HStack>
                        <HStack spacing={10} mt={4}>
                            <Radio value="once_every_week">Once every week</Radio>
                            <Radio value="other">Other</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>




                <FormControl isRequired>
                    <FormLabel>Were the Lifeskills classes beneficial to you?</FormLabel>
                    <RadioGroup 
                    name="lifeskills">
                        <HStack spacing={4}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Would you recommend CCH to a friend?</FormLabel>
                    <RadioGroup 
                    name="recommend">
                        <HStack spacing={4}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                        <FormLabel>Why or why not?</FormLabel>
                        <Textarea name='recommend_reasoning' placeholder="Enter your response..."/>
                </FormControl>

                <FormControl isRequired>
                        <FormLabel>If you entered our program because of a referral, how might we have made CCH more helpful?</FormLabel>
                        <Textarea name='make_cch_more_helpful' placeholder="Enter your response..."/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Who is your case manager?</FormLabel>
                    <Textarea name='cm_id' placeholder="Enter your response..."/>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>What feedback would you like your case manager to know?</FormLabel>
                    <Textarea name='cm_feedback' placeholder="Enter your response..."/>
                </FormControl>
                
                <FormControl>
                    <FormLabel>Please share any additional comments or suggestions.</FormLabel>
                    <Textarea name='other_comments' placeholder="Enter your response..."/>
                </FormControl>

                <Button type="submit" color="blue">
                    Submit
                </Button>


                </VStack>
            </form>

        </VStack>
    )
}