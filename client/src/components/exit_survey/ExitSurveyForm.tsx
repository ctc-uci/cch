import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Progress,
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

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import type { ExitSurveyForm as ExitSurveyFormType } from "../../types/exitSurvey.ts";

type ExitSurveyFormProps = {
  formData: ExitSurveyFormType;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<ExitSurveyFormType>>;
  onReview: boolean;
};

export const ExitSurveyForm = ({
  formData,
  setFormData,
  handleSubmit,
  onReview,
}: ExitSurveyFormProps) => {
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
    cm_id: number;
    name: string;
    date: Date;
    caloptima_funded: boolean;
  };

  const [locations, setLocations] = useState<Location[]>([]);
  const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
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

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | Date } }
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string) => (value: string) => {
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Box
      maxW="800px"
      mx="auto"
      p={6}
    >
      <form onSubmit={handleSubmit}>
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
            We are committed to providing you with the best help possible, so we
            welcome your comments. Please fill out this questionnaire. Thank
            you!
          </Text>

          <Divider />

          <Stack
            direction={["column", "row"]}
            spacing={4}
            w="100%"
          >
            <FormControl isRequired>
              <FormLabel>1. What is your first name?</FormLabel>
              <Input
                name="name"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.name}
                isDisabled={onReview}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>2. Where is your site?</FormLabel>
              <Select
                name="location"
                placeholder="Select Location"
                onChange={handleChange}
                value={formData.location}
                isDisabled={onReview}
              >
                {locations.map((loc) => (
                  <option
                    key={loc.id}
                    value={loc.id.toString()}
                  >
                    {loc.name}
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
                name="cmId"
                placeholder="Select case manager"
                onChange={handleChange}
                value={formData.cmId}
                isDisabled={onReview}
              >
                {caseManagers.map((cm) => (
                  <option
                    key={cm.id}
                    value={cm.id.toString()}
                  >
                    {cm.firstName} {cm.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>4. Date of Program Completion</FormLabel>
              <Input
                name="programDateCompletion"
                type="date"
                placeholder="Date"
                value={formData.programDateCompletion}
                onChange={handleChange}
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
            <FormLabel>1. How helpful were the Life Skills Meetings?</FormLabel>
            <RadioGroup
              name="cchRating"
              value={formData.cchRating}
              onChange={handleRadioChange("cchRating")}
              isDisabled={onReview}
            >
              <HStack spacing={6}>
                <Radio value="Unsatisfactory">Unsatisfactory</Radio>
                <Radio value="Fair">Fair</Radio>
                <Radio value="Good">Good</Radio>
                <Radio value="Excellent">Excellent</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              2. What did you like most about Colette’s Children’s Home?
            </FormLabel>
            <Textarea
              name="cchLikeMost"
              placeholder="Enter your response..."
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cchLikeMost}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              3. What would make Colette’s Children’s home better?
            </FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="cchCouldBeImproved"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cchCouldBeImproved}
            />
          </FormControl>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            Life Skills
          </Text>

          <FormControl isRequired>
            <FormLabel>1. How helpful were the Life Skills Meetings?</FormLabel>
            <RadioGroup
              name="lifeSkillsRating"
              onChange={handleRadioChange("lifeSkillsRating")}
              isDisabled={onReview}
              value={formData.lifeSkillsRating}
            >
              <HStack spacing={6}>
                <Radio value="Unsatisfactory">Unsatisfactory</Radio>
                <Radio value="Fair">Fair</Radio>
                <Radio value="Good">Good</Radio>
                <Radio value="Excellent">Excellent</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>2. What topics were the most helpful for you?</FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="lifeSkillsHelpfulTopics"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.lifeSkillsHelpfulTopics}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              3. What topics would you like CCH to offer in the future?
            </FormLabel>
            <Textarea
              name="lifeSkillsOfferTopicsInTheFuture"
              placeholder="Enter your response..."
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.lifeSkillsOfferTopicsInTheFuture}
            />
          </FormControl>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            Case Management
          </Text>

          <FormControl isRequired>
            <FormLabel>1. How helpful was case management?</FormLabel>
            <RadioGroup
              name="cmRating"
              onChange={handleRadioChange("cmRating")}
              isDisabled={onReview}
              value={formData.cmRating}
            >
              <HStack spacing={6}>
                <Radio value="Unsatisfactory">Unsatisfactory</Radio>
                <Radio value="Fair">Fair</Radio>
                <Radio value="Good">Good</Radio>
                <Radio value="Excellent">Excellent</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>2. What would you change about your case?</FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="cmChangeAbout"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cmChangeAbout}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              2. What was the most beneficial part of your case management?
            </FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="cmMostBeneficial"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.cmMostBeneficial}
            />
          </FormControl>

          <Divider />

          <Text
            fontSize="3xl"
            color="#3182CE"
            pt={4}
          >
            Outcome
          </Text>

          <FormControl isRequired>
            <FormLabel>
              1. How do you think that your experience at CCH will change your
              future?
            </FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="experienceTakeaway"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.experienceTakeaway}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              2. What have you learned/accomplished while during your stay?
            </FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="experienceAccomplished"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.experienceAccomplished}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>2. What else would you like us to know?</FormLabel>
            <Textarea
              placeholder="Enter your response..."
              name="experienceExtraNotes"
              onChange={handleChange}
              isDisabled={onReview}
              value={formData.experienceExtraNotes}
            />
          </FormControl>

          <Spacer />

          <Flex
            justifyContent={"flex-end"}
            width={"100%"}
          >
            <Button
              type="submit"
              size={"lg"}
              colorScheme="blue"

              // isDisabled={Object.keys(errors).length > 0}
            >
              Next
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

//       return (
//       <VStack
//         spacing={8}
//         sx={{ width: 800, marginX: "auto" }}
//       >
//         <Heading textAlign={"center"}>
//           Colette’s Children’s Home <br />
//           Participant Satisfaction Survey
//         </Heading>

//         <form
//           style={{ width: "100%" }}
//           onSubmit={handleSubmit}
//         >
//           <Stack spacing={4}>
//             <HStack spacing={2}>
//               <FormControl isRequired>
//                 <FormLabel>Name</FormLabel>
//                 <Input
//                   name="name"
//                   placeholder="Name"
//                 />
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel>Case Manager</FormLabel>
//                 <Select
//                   name="cmId"
//                   placeholder="Select your case manager"
//                 >
//                   {caseManagers.map((manager: CaseManager) => (
//                     <option
//                       key={manager.id}
//                       value={manager.id}
//                     >
//                       {manager.firstName} {manager.lastName}
//                     </option>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl isRequired>
//                 <FormLabel>Site</FormLabel>
//                 <Select
//                   name="site"
//                   placeholder="Site"
//                 >
//                   {locations.map((location: Location) => (
//                     <option
//                       key={location.id}
//                       value={location.id}
//                     >
//                       {location.name}
//                     </option>
//                   ))}
//                 </Select>
//               </FormControl>
//             </HStack>

// <FormControl isRequired>
//   <FormLabel>Date of Program Completion</FormLabel>
//   <Input
//     name="programDateCompletion"
//     type="date"
//     placeholder="Date"
//   />
// </FormControl>

//             <Text
//               style={{
//                 fontWeight: "bold",
//                 marginTop: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               Thank you for taking the time to complete this survey. We value your
//               feedback and use your suggestions to make important program
//               improvements.{" "}
//             </Text>

//             <Text style={{ fontWeight: "bold" }}>Overall Program</Text>

//             <FormControl isRequired>
//               <FormLabel>
//                 How would you rate Colette’s Children’s Home overall? (circle one)
//               </FormLabel>
//               <RadioGroup name="cchRating">
//                 <HStack spacing={4}>
//                   <Radio value="Excellent">Excellent</Radio>
//                   <Radio value="Good">Good</Radio>
//                   <Radio value="Fair">Fair</Radio>
//                   <Radio value="Poor">Unsatisfactory</Radio>
//                 </HStack>
//               </RadioGroup>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>
//                 What did you like most about Colette’s Children’s Home?
//               </FormLabel>
//               <Textarea
//                 name="cchLikeMost"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>
//                 What would make Colette’s Children’s home better?
//               </FormLabel>
//               <Textarea
//                 name="cchCouldBeImproved"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <Text style={{ fontWeight: "bold" }}>Life Skills</Text>

//             <FormControl isRequired>
//               <FormLabel>
//                 How helpful were the Life Skills Meetings? (circle one)
//               </FormLabel>
//               <RadioGroup name="lifeSkillsRating">
//                 <HStack spacing={4}>
//                   <Radio value="very helpful">Very Helpful</Radio>
//                   <Radio value="helpful">Helpful</Radio>
//                   <Radio value="not very helpful">Not Very Helpful</Radio>
//                   <Radio value="not helpful at all">Not Helpful at All</Radio>
//                 </HStack>
//               </RadioGroup>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>What topics were the most helpful for you?</FormLabel>
//               <Textarea
//                 name="lifeSkillsHelpfulTopics"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>
//                 What topics would you like CCH to offer in the future?
//               </FormLabel>
//               <Textarea
//                 name="lifeSkillsOfferTopicsInTheFuture"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <Text style={{ fontWeight: "bold" }}>Case Manager</Text>

//             <FormControl isRequired>
//               <FormLabel>How helpful was case management?</FormLabel>
//               <RadioGroup name="cmRating">
//                 <HStack spacing={4}>
//                   <Radio value="very helpful">Very Helpful</Radio>
//                   <Radio value="helpful">Helpful</Radio>
//                   <Radio value="not very helpful">Not Very Helpful</Radio>
//                   <Radio value="not helpful at all">Not Helpful at All</Radio>
//                 </HStack>
//               </RadioGroup>
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>What would you change about case management?</FormLabel>
//               <Textarea
//                 name="cmChangeAbout"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>
//                 What was the most beneficial part of case management?
//               </FormLabel>
//               <Textarea
//                 name="cmMostBeneficial"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <Text style={{ fontWeight: "bold" }}>Outcomes</Text>

//             <FormControl isRequired>
//               <FormLabel>
//                 How do you think that your experience at CCH will change your
//                 future?
//               </FormLabel>
//               <Textarea
//                 name="experienceTakeaway"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>
//                 What have you learned/accomplished while during your stay?
//               </FormLabel>
//               <Textarea
//                 name="experienceAccomplished"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel>What else would you like us to know? </FormLabel>
//               <Textarea
//                 name="experienceExtraNotes"
//                 placeholder="Enter your response..."
//               />
//             </FormControl>

//             <Text style={{ fontWeight: "bold" }}>Thank you!</Text>

//             <Button
//               type="submit"
//               size={"lg"}
//               sx={{ width: "100%" }}
//               //isDisabled={Object.keys(errors).length > 0}
//             >
//               Submit
//             </Button>
//           </Stack>
//         </form>
//       </VStack>
//     );
//   };
// );
