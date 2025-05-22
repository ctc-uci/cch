import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
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
import { ProgressSteps } from "../ProgressSteps";
import { SuccessScreen } from "../SuccessScreen";
import { SuccessStoryForm } from "./SuccessStoryForm";
import type { SuccessStoryForm as SuccessStoryFormType} from "../../types/successStory";

export type CaseManager = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
};

export type Location = {
  id: number;
  cm_id: number; // Adjust the type for 'role' as per your actual data type (e.g., 'admin', 'user', etc.)
  name: string;
  date: Date;
  caloptima_funded: boolean;
};


export const SuccessStory = () => {
  const { backend } = useBackendContext();
  const toast = useToast();
  const [onReview, setOnReview] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<SuccessStoryFormType>({
    name: "",
    site: 0,
    cm_id: 0,
    entrance_date: new Date(),
    exit_date: new Date(),
    date: new Date(),
    previous_situation: "",
    cch_impact: "",
    where_now: "",
    tell_donors: "",
    quote: "",
    consent: false,
    client_id: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onReview) {
      const form = event.currentTarget;
      const formDataObj = new FormData(form);
      const data = Object.fromEntries(formDataObj);
      const typedFormData: SuccessStoryFormType = {
        name: String(data.name || ""),
        site: Number(data.site || 0),
        cm_id: Number(data.cm_id || 0),
        entrance_date: new Date(data.entrance_date as string),
        exit_date: new Date(data.exit_date as string),
        date: new Date(data.date as string),
        previous_situation: String(data.previous_situation || ""),
        cch_impact: String(data.cch_impact || ""),
        where_now: String(data.where_now || ""),
        tell_donors: String(data.tell_donors || ""),
        quote: String(data.quote || ""),
        consent: formDataObj.has("consent"),
        client_id: null,
      };
      setFormData(typedFormData);
      setOnReview(true);
    } else {
      try {
        await backend.post("/successStory", formData);
        toast({
          title: "Form submitted",
          description: `Thanks for your feedback!`,
          status: "success",
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Error submitting success story:", error);
        toast({
          title: "An error occurred",
          description: `Success story response was not created: ${error.message}`,
          status: "error",
        });
      }
    }
  };

  if (submitted) {
    return <SuccessScreen />;
  }

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
            <SuccessStoryForm
              onSubmit={handleSubmit}
              onReview={onReview}
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleSubmit(
                    e as unknown as React.FormEvent<HTMLFormElement>
                  );
                }}
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
