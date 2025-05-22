import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CaseManager, Location } from "./SuccessStory";

export const SuccessStoryForm = ({
  onSubmit,
  onReview,
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onReview: boolean;
}) => {
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
    <Box
      maxW="800px"
      mx="auto"
      p={6}
    >
      <form onSubmit={onSubmit}>
        <VStack
          align="start"
          spacing={6}
        >
          <Text
            fontSize="3xl"
            color="#3182CE"
          >
            Exit Survey
          </Text>
          <Text>
            We are committed to providing you the best help possible, so we
            welcome your comments. <br />
            Please fill out the questionnaire. Thank you!
          </Text>

          <Divider />

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>1. What is your first name?</FormLabel>
              <Input name="name" isDisabled={onReview} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>2. What was your site? </FormLabel>
              <Select
                name="site"
                placeholder="Select your site"
                isDisabled={onReview}
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
          </Stack>

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>3. Who is your case manager?</FormLabel>
              <Select
                name="cm_id"
                placeholder="Select your case manager"
                maxW="530px"
                isDisabled={onReview}
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

            <FormControl isRequired>
              <FormLabel>4. Entrance Date to CCH </FormLabel>
              <Input
                name="entrance_date"
                type="date"
                placeholder="Date"
                isDisabled={onReview}
              />
            </FormControl>
          </Stack>

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>5. Exit Date from CCH </FormLabel>
              <Input
                name="exit_date"
                type="date"
                placeholder="Date"
                isDisabled={onReview}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>6. Today's Date </FormLabel>
              <Input
                name="date"
                type="date"
                placeholder="Date"
                isDisabled={onReview}
              />
            </FormControl>
          </Stack>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            Overall Program
          </Text>

          <FormControl isRequired>
            <FormLabel>
              1. Please tell us your situation before entering Colette's
              Children's Home. Please give as many details as you are
              comfortable with about your story, how long you were homeless,
              what led to homelessness, etc. We want to help people understand
              what being homeless is like.
            </FormLabel>
            <Textarea
              name="previous_situation"
              placeholder="Enter your response..."
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              2. Tell us about your time in CCH and how CCH was part of the
              solution to your situation and the impact it had on you and and/or
              your children. What was most helpful, what you learned, etc.
            </FormLabel>
            <Textarea
              name="cch_impact"
              placeholder="Enter your response..."
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              3. Tell us where you are now. If you are graduating where are you
              moving, are you working, how are your children doing, etc. Tell us
              a finish to your story.
            </FormLabel>
            <Textarea
              name="where_now"
              placeholder="Enter your response..."
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              4. If you had the opportunity to tell one of our donors what it
              meant to you to be at CCH or how important it is to provide our
              services to other women, what would you say?
            </FormLabel>
            <Textarea
              name="tell_donors"
              placeholder="Enter your response..."
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              5. Please give a 1 to 2 sentence quote of what the CCH experience
              meant to you?
            </FormLabel>
            <Textarea
              name="quote"
              placeholder="Enter your response..."
              isDisabled={onReview}
            />
          </FormControl>

          <FormControl>
            <HStack
              spacing={2}
              alignItems="center"
            >
              <Checkbox 
                name="consent"
                mt={1}
                isDisabled={onReview}
              />
              <FormLabel>
                By checking the box, I consent to letting Colette's Children's
                Home use all or part of my story in their marketing materials,
                such as website, newsletter, brochures, videos, etc.
              </FormLabel>
            </HStack>
          </FormControl>

          {!onReview && (
            <Flex
              justifyContent="flex-end"
              width="100%"
            >
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
              >
                Next
              </Button>
            </Flex>
          )}
        </VStack>
      </form>
    </Box>
  );
};
