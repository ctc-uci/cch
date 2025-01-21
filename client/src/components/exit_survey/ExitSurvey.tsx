import {
    Button,
    Center,
    Link as ChakraLink,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    Heading,
    Input,
    Stack,
    useToast,
    VStack,
    FormLabel,
    HStack,
    Textarea,
    Text,
    Radio,
    RadioGroup,
  } from "@chakra-ui/react";

import { z } from "zod";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const ExitSurvey = () => {

    const { backend } = useBackendContext();
    const toast = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await backend.post("/exitSurvey", data);
            console.log(response)
        } catch (e) {
            toast({
                title: "An error occurred",
                description: `Exit survey response was not created: ${e.message}`,
                status: "error",
            });
        }
    }

    return (
        <VStack
            spacing={8}
            sx={{ width: 800, marginX: "auto" }}
        >
            <Heading
            textAlign={"center"}
            >Colette’s Children’s Home <br />Participant Satisfaction Survey</Heading>
            
            <form style={{ width: '100%'}} onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <HStack spacing={2}>

                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input name='name' placeholder='Name' />
                    </FormControl>  

                    <FormControl isRequired>
                        <FormLabel>Site</FormLabel>
                        <Input name='site' placeholder='Site' />
                    </FormControl>  

                    <FormControl isRequired>
                        <FormLabel>Case Manager</FormLabel>
                        <Input name='cmId' placeholder='Case Manager' />
                    </FormControl> 

                    </HStack>

                    <FormControl isRequired>
                        <FormLabel>Date of Program Completion</FormLabel>
                        <Input name='programDateCompletion' type='date' placeholder='Date' />
                    </FormControl> 

                    <Text style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '10px'}}>Thank you for taking the time to complete this survey.  We value your feedback and use your suggestions to make important program improvements.  </Text>
                    
                    <Text style={{fontWeight: 'bold'}}>Overall Program</Text>

                    <FormControl isRequired>
                        <FormLabel>How would you rate Colette’s Children’s Home overall? (circle one)</FormLabel>
                        <RadioGroup name='cchRating'>
                            <HStack spacing={4}>
                                <Radio value='excellent'>Excellent</Radio>
                                <Radio value='good'>Good</Radio>
                                <Radio value='fair'>Fair</Radio>
                                <Radio value='poor'>Unsatisfactory</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What did you like most about Colette’s Children’s Home?</FormLabel>
                        <Textarea name='cchLikeMost' placeholder="Enter your response..."/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What would make Colette’s Children’s home better?</FormLabel>
                        <Textarea name='cchCouldBeImproved' placeholder="Enter your response..."/>
                    </FormControl>

                    <Text style={{fontWeight: 'bold'}}>Life Skills</Text>

                    <FormControl isRequired>
                        <FormLabel>How helpful were the Life Skills Meetings?  (circle one)</FormLabel>
                        <RadioGroup name='life_skills_rating'>
                            <HStack spacing={4}>
                                <Radio value='very helpful'>Very Helpful</Radio>
                                <Radio value='helpful'>Helpful</Radio>
                                <Radio value='not very helpful'>Not Very Helpful</Radio>
                                <Radio value='not helpful at all'>Not Helpful at All</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What topics were the most helpful for you?</FormLabel>
                        <Textarea name='lifeSkillsHelpfulTopics' placeholder="Enter your response..."/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What topics would you like CCH to offer in the future?</FormLabel>
                        <Textarea name='lifeSkillsOfferTopicsInTheFuture' placeholder="Enter your response..."/>
                    </FormControl>

                    <Text style={{fontWeight: 'bold'}}>Case Manager</Text>

                    <FormControl isRequired>
                        <FormLabel>How helpful was case management?</FormLabel>
                        <RadioGroup name='cmRating'>
                            <HStack spacing={4}>
                                <Radio value='very helpful'>Very Helpful</Radio>
                                <Radio value='helpful'>Helpful</Radio>
                                <Radio value='not very helpful'>Not Very Helpful</Radio>
                                <Radio value='not helpful at all'>Not Helpful at All</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What would you change about case management?</FormLabel>
                        <Textarea name='cmChangeAbout' placeholder="Enter your response..."/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What was the most beneficial part of case management?</FormLabel>
                        <Textarea name='cmMostBeneficial' placeholder="Enter your response..."/>
                    </FormControl>

                    <Text style={{fontWeight: 'bold'}}>Outcomes</Text>

                    <FormControl isRequired>
                        <FormLabel>How do you think that your experience at CCH will change your future?</FormLabel>
                        <Textarea name='experienceTakeaway' placeholder="Enter your response..."/>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>What have you learned/accomplished while during your stay?</FormLabel>
                        <Textarea name='experienceAccomplished' placeholder="Enter your response..."/>
                    </FormControl>

                    <FormControl>
                        <FormLabel>What else would you like us to know? </FormLabel>
                        <Textarea name='experienceExtraNotes' placeholder="Enter your response..."/>
                    </FormControl>

                    <Text style={{fontWeight: 'bold'}}>Thank you!</Text>

                    <Button
                        type="submit"
                        size={"lg"}
                        sx={{ width: "100%" }}
                        //isDisabled={Object.keys(errors).length > 0}
                    >
                        Submit
                    </Button>
                </Stack>
            </form>
        </VStack>
    )
}