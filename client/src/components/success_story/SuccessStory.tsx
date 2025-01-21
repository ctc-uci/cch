import {
    Button,
    Center,
    Link as ChakraLink,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Stack,
    VStack,
    Radio,
    RadioGroup,
    Textarea,
    useToast
  } from "@chakra-ui/react";

import {useState} from "react"
import { useForm } from "react-hook-form"

import { z } from "zod";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";


export const SuccessStory = () => {
    const [ClientStatus, setStatus] = useState('1');
    const [consent, setConsent] = useState(false);

    const handleChange = (event) => {
      setConsent(event.target.consent);
    };

    const { backend } = useBackendContext();
    const toast = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const finalData = {
            'consent': consent,
            ...data
        }

        try {
            const response = await backend.post("/successStory", finalData);
        } catch (e) {
            toast({
                title: "An error occurred",
                description: `Success story response was not created: ${e.message}`,
                status: "error",
            });
        }
    }
    return (
        <VStack
        spacing={8}
        sx={{ width: 300, marginX: "auto" }}
      >
        <Heading>Success Story</Heading>
  
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          <Stack spacing={2}>

            <FormControl isRequired>
                <FormLabel>Client Name</FormLabel>
                <Input placeholder='First name' />
            </FormControl>  
            
            <FormControl isRequired>
                <FormLabel>Case Manager</FormLabel>
                <Input placeholder='Case Manager'/>
            </FormControl>  

            <FormControl isRequired>
                <FormLabel>Site</FormLabel>
                <Input placeholder='Site' />
            </FormControl>  

            <RadioGroup onChange={setStatus} value={ClientStatus}>
                <Stack direction='row'>
                    <Radio value='CurrentClient'>Current Client</Radio>
                    <Radio value='Graduate'>Graduate</Radio>
                </Stack>    
            </RadioGroup>

            <FormControl isRequired>
                <FormLabel>Entrance Date to CCH</FormLabel>
                <Input type="date"/>
            </FormControl>  
            
            <FormControl isRequired>
                <FormLabel>Exit Date to CCH</FormLabel>
                <Input type="date"/>
            </FormControl>  

            <FormControl isRequired>
                <FormLabel>Please tell us your situation before entering Colette’s Children’s Home.
                     Please give as many details as you are comfortable with about your story, how long you were
                      homeless, what led to homelessness, etc. We want to help people understand what being
                       homeless is like. </FormLabel>
                <Textarea name='previous_situation' />
            </FormControl>  

            <FormControl isRequired>
                <FormLabel>Tell us about your time in CCH and how CCH was part of the solution to your situation and the impact it had on you
                     and and/or your children. What was most helpful, what you learned, etc.  </FormLabel>
                <Textarea name='cch_impact'/>
            </FormControl>  

            
            <FormControl isRequired>
                <FormLabel>Tell us where you are now. If you are graduating where are you moving, 
                  are you working, how are your children doing, etc. Tell us a finish to your story. </FormLabel>
                <Textarea name='where_now'/>
            </FormControl>  

            <FormControl isRequired>
                <FormLabel>If you had the opportunity to tell one of our donors what it meant to you to be at CCH or how important
                     it is to provide our services to other women, what would you say?</FormLabel>
                <Textarea name='tell_donors'/>
            </FormControl> 

            <FormControl isRequired>
                <FormLabel>Please give a 1 to 2 sentence quote of what the CCH experience meant to you?                </FormLabel>
                <Textarea name='quote'/>
            </FormControl> 

            I consent to letting Colette’s Children’s Home se all or part of my story in their 
            marketing materials, such as website, newsletter, brochures, videos, etc. 
            <Input type="radio" onChange={handleChange}>Yes</Input>
            <FormControl isRequired>
                <FormLabel>Client Signature:
                </FormLabel>
                <Input/>
            </FormControl>  

            <FormControl isRequired>
                <FormLabel>Date:</FormLabel>
                <Input name='date' type="date"/>
            </FormControl>  

            <Button
              type="submit"
              size={"lg"}
              sx={{ width: "100%" }}
            >
              Submit
            </Button>
          </Stack>
        </form>

      </VStack>
    );
}