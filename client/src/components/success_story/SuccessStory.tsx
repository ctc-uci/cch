import {
    Button,
    Link as ChakraLink,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    VStack,
    Radio,
    RadioGroup,
    Textarea,
    useToast,
    Select
  } from "@chakra-ui/react";

import {useState, useEffect} from "react"

import { useBackendContext } from "../../contexts/hooks/useBackendContext";


export const SuccessStory = () => {
    type CaseManager = {
        id: number;
        role: string;  
        firstName: string;
        lastName: string;
        phone_number: string;
        email: string;
    };

    type Location = {
        id: number;
        cm_id: number;  // Adjust the type for 'role' as per your actual data type (e.g., 'admin', 'user', etc.)
        name: string;
        date: Date;
        caloptima_funded: boolean;
    };

    const [ClientStatus, setStatus] = useState('1');
    const [locations, setLocations] = useState([]);
    const [caseManagers, setCaseManagers] = useState([]);


    const { backend } = useBackendContext();
    const toast = useToast();

      useEffect(() => {
            const getLocations = async () => {
                try {
                    const response = await backend.get("/locations");
                    setLocations(response.data);
                } catch (e) {
                    toast({
                        title: "An error occurred",
                        description: `Locations were not fetched: ${e.message}`,
                        status: "error",
                    });
                }
            }
        
            const getCaseManagers = async () => {
                try {
                    const response = await backend.get("/caseManagers");
                    setCaseManagers(response.data);
                } catch (e) {
                    toast({
                        title: "An error occurred",
                        description: `Case Managers were not fetched: ${e.message}`,
                        status: "error",
                    });
                }
            }
            getLocations();
            getCaseManagers();
        }, [backend, toast]);



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log("CONSETN!!!", data.consent);

        try {
            await backend.post("/successStory", data);
            toast({
                title: "Form submitted",
                description: `Thanks for your feedback!`,
                status: "success",
            });
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
                <Input name="name" placeholder='First name' />
            </FormControl>  
            
            <FormControl isRequired>
                <FormLabel>Case Manager</FormLabel>
                <Select name="cm_id" placeholder="Select your case manager">
                        {caseManagers.map((manager: CaseManager) => (
                            <option key={manager.id}  value={manager.id}>
                                {manager.firstName} {manager.lastName}
                            </option >
                            ))}
                        </Select>
            </FormControl>  

            <FormControl isRequired>
                <FormLabel>Site</FormLabel>
                <Select name="site" placeholder="Site">
                        {locations.map((location: Location) => (
                            <option key={location.id}  value={location.id}>
                                {location.name}
                            </option >
                            ))}
                </Select>
            </FormControl>  

            <RadioGroup onChange={setStatus} value={ClientStatus}>
                <Stack direction='row'>
                    <Radio value='CurrentClient'>Current Client</Radio>
                    <Radio value='Graduate'>Graduate</Radio>
                </Stack>    
            </RadioGroup>

            <FormControl isRequired>
                <FormLabel>Entrance Date to CCH</FormLabel>
                <Input name="entrance_date"type="date"/>
            </FormControl>  
            
            <FormControl isRequired>
                <FormLabel>Exit Date to CCH</FormLabel>
                <Input name="exit_date"type="date"/>
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
            <FormControl isRequired>
                <FormLabel>Consent </FormLabel>
                <Radio type="radio" name="consent" value="true">Yes</Radio>
            </FormControl>  
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