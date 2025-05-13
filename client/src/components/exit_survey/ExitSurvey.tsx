import { FormEvent, useEffect, useRef, useState } from "react";

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

import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { ExitSurveyForm as ExitSurveyFormType } from "../../types/exitSurvey.ts";
import { ExitSurveyForm } from "./ExitSurveyForm.tsx";
import { ProgressSteps } from "./ProgressSteps.tsx";

const initialFormData = {
  name: "",
  cmId: 0,
  site: 0,
  programDateCompletion: "",
  cchRating: "",
  cchLikeMost: "",
  cchCouldBeImproved: "",
  lifeSkillsRating: "",
  lifeSkillsHelpfulTopics: "",
  lifeSkillsOfferTopicsInTheFuture: "",
  cmRating: "",
  cmChangeAbout: "",
  cmMostBeneficial: "",
  experienceTakeaway: "",
  experienceAccomplished: "",
  experienceExtraNotes: "",
};

export const ExitSurvey = () => {
  const navigate = useNavigate();
  const [onReview, setOnReview] = useState<boolean>(false);
  const [formData, setFormData] = useState<ExitSurveyFormType>(initialFormData);
  const { backend } = useBackendContext();
  const toast = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (onReview) {
      try {
        await backend.post("/exitSurvey", formData);
        toast({
          title: "Form submitted",
          description: `Thanks for your feedback!`,
          status: "success",
        });
      } catch (e) {
        console.error(e);
        toast({
          title: "An error occurred",
          description: `Exit survey response was not created: ${e.message}`,
          status: "error",
        });
      }
    } else {
      setOnReview(true);
    }
  };

  return (
    <Box
      bg={onReview ? "#E7F0F4" : "transparent"}
      p={4}
      minH="100vh"
    >
      <Box
        width="60%"
        justifyContent={"center"}
        mx="auto"
      >
        <ProgressSteps onReview={onReview} />
        {onReview && (
          <Text
            fontSize="4xl"
            color="blue.400"
            pl={4}
            mx="auto"
            fontWeight="normal"
          >
            Review
          </Text>
        )}
        <VStack
          spacing={4}
          align="stretch"
        >
          <Spacer />
          <Box
            maxH={onReview ? "100vh" : "auto"}
            overflowY={onReview ? "auto" : "visible"}
            bg={onReview ? "white" : "transparent"}
            borderRadius={onReview ? "xl" : "none"}
            boxShadow={onReview ? "sm" : "none"}
            p={onReview ? 8 : 0}
            mx={onReview ? "auto" : 0}
            maxW={onReview ? "800px" : "auto"}
          >
            <ExitSurveyForm
              formData={formData}
              handleSubmit={handleSubmit}
              setFormData={setFormData}
              onReview={onReview}
              setOnReview={setOnReview}
            />
          </Box>

          {onReview && (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Button
                onClick={() => setOnReview(false)}
                bg="#C4C4C4"
                size="lg"
              >
                Cancel
              </Button>

              <Button
                size="lg"
                colorScheme="blue"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
