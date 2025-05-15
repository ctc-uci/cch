import { useEffect, useState } from "react";
import { CaseManager, Location } from "./SuccessStory";

import {
  Button,
  Link as ChakraLink,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  useToast,
  VStack,
  Text,
  HStack,
  Box,
  
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const SuccessStoryForm = ({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> }) => {
    const [ClientStatus, setStatus] = useState("");
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
      };
  
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
      };
      getLocations();
      getCaseManagers();
    }, [backend, toast]);
    return (
        <VStack
      spacing={8}
      sx={{ width: "90%", marginX: "5%", marginY: 100 }}
      align={"left"}
      > 
      <VStack
      align = {"left"}>
        <Text variant={'h2'}>Participant Satisfaction Survey</Text>
        <Text variant = {"body"}>We are committed to providing you the best help possible, so we welcome your comments. <br></br>
        Please fill out the questionnaire below and we will get back to you as soon as possible.
        </Text>
      </VStack>
  
      <hr style={{ width: "50%", color: "black" }}></hr>
  
      <form
        style={{ width: "100%" }}
        onSubmit={onSubmit}
      >
        <Stack spacing={4} >
          <HStack
          spacing = {30}
          pb = {4}
          >
            <FormControl isRequired>
              <FormLabel fontWeight={400} variant={'body'}><span style={{ fontWeight: "bold" }}>1.</span> What is your first name?</FormLabel>
              <Input
                name="name"
                placeholder=""
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight={400} variant={"body"}><span style={{fontWeight: "bold"}}>2.</span> Where is your site?</FormLabel>
              <Select 
                name="site"
                placeholder="Select your site"
              >
                {locations.map((location: Location) => (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {location.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>
          
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>3.</span> Who is your manager?</FormLabel>
            <Select
              name="cm_id"
              placeholder="Select your case manager"
              maxW = "530px"
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
          
          <hr style={{ width: "50%", marginTop: 20, marginBottom: 20 }}></hr>
          
          <Text variant={'h2'}>Overall Program</Text>
          
          <FormControl isRequired>
          <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>4.</span> Are you a current client or a graduate?</FormLabel>
            <RadioGroup
              onChange={setStatus}
              value={ClientStatus}
            >
              <Stack direction="row">
                <Radio value="CurrentClient">Current Client</Radio>
                <Radio value="Graduate">Graduate</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>5.</span> Entrance Date to CCH</FormLabel>
            <Input
              name="entrance_date"
              type="date"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>6.</span> Exit Date to CCH</FormLabel>
            <Input
              name="exit_date"
              type="date"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>7.</span> Please tell us your situation before entering Colette's Children's
                Home. Please give as many details as you are comfortable with
                about your story, how long you were homeless, what led to
                homelessness, etc. We want to help people understand what being
                homeless is like.</FormLabel>
            <Textarea name="previous_situation" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>8.</span> Tell us about your time in CCH and how CCH was part of the
              solution to your situation and the impact it had on you and and/or
              your children. What was most helpful, what you learned, etc.{" "}</FormLabel>
            <Textarea name="cch_impact"  />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>9.</span> Tell us where you are now. If you are graduating where are you
              moving, working, how are your children doing, etc. Tell us
              a finish to your story.{" "}</FormLabel>
            <Textarea name="where_now" />
          </FormControl>
          <FormControl isRequired>
          <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>10.</span> If you had the opportunity to tell one of our donors what it meant
              to you to be at CCH or how important it is to provide our services
              to other women, what would you say?</FormLabel>
            <Textarea name="tell_donors" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>11.</span> Please give a 1 to 2 sentence quote of what the CCH experience
            meant to you?{" "}</FormLabel>
            <Textarea name="quote"/>
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>12.</span> Consent</FormLabel>
            <Radio
              type="radio"
              name="consent"
              value="true"
            >
              Yes
            </Radio>
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>13.</span> Client Signature:</FormLabel>
            <Input />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight="400" variant={"body"}><span style = {{fontWeight: "bold"}}>13.</span> Date:</FormLabel>
            <Input
              name="date"
              type="date"
            />
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
    )
  }