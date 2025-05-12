import { useEffect, useRef, useState } from "react";

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
  location: "",
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onReview) {
      try {
        console.log(formData)
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
    p={4}>
      <ProgressSteps onReview={onReview} />
      <ExitSurveyForm
        formData={formData}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        onReview={onReview}
      />
    </Box>
  );
};
