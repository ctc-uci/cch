import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ExitSurveyForm } from "./ExitSurveyForm.tsx";
import { ProgressSteps } from "../ProgressSteps.tsx";
import { SuccessScreen } from "../SuccessScreen.tsx";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

export const ExitSurvey = () => {
  const [onReview, setOnReview] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const { backend } = useBackendContext();
  const toast = useToast();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const params = useParams();
  const language = params.language || "english";
  const { currentUser } = useAuthContext();


  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (onReview) {
      try {
        const response = await backend.get(`/clients/email/${encodeURIComponent(currentUser?.email || "")}`);
        const client = response.data?.[0];
        const payload = {
          ...formData,
          client_id: client?.id,
        };
        await backend.post("/exitSurvey", payload);
        toast({
          title: "Form submitted",
          description: `Thanks for your feedback!`,
          status: "success",
        });
        setSubmitted(true);
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
            <ExitSurveyForm
              formData={formData}
              handleSubmit={handleSubmit}
              setFormData={setFormData}
              onReview={onReview}
              setOnReview={setOnReview}
              spanish={language === "spanish"}
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
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
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
