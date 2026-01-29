import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ProgressSteps } from "../ProgressSteps";
import { SuccessScreen } from "../SuccessScreen";
import { SuccessStoryForm } from "./SuccessStoryForm";
import type { SuccessStoryForm as SuccessStoryFormType} from "../../types/successStory";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { ChevronLeftIcon } from "@chakra-ui/icons/ChevronLeft";

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
  const params = useParams();
  const language = params.language?.toLowerCase() === "spanish" ? "spanish" : "english";
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onReview) {
      setOnReview(true);
    } else {
      try {
        // Try to get client from intakeClients first, then fall back to clients table
        // If not found, backend will create one automatically
        let clientData = null;
        try {
          const intakeResponse = await backend.get(`/intakeClients/email/${encodeURIComponent(currentUser?.email || "")}`);
          if (intakeResponse.data && intakeResponse.data.length > 0) {
            clientData = intakeResponse.data[0];
          }
        } catch {
          // If intakeClients doesn't have the client, try the old clients table
          try {
            const response = await backend.get(`/clients/email/${encodeURIComponent(currentUser?.email || "")}`);
            if (response.data && response.data.length > 0) {
              clientData = response.data[0];
            }
          } catch {
            // Client not found in either table - backend will create one
          }
        }

        // Include email so backend can create client if needed
        // Include client_id if found, otherwise backend will create one
        const payload = {
          ...formData,
          email: currentUser?.email,
          ...(clientData && { client_id: clientData.id }),
        };
        await backend.post("/successStory", payload);
        toast({
          title: language === "spanish" ? "Formulario enviado" : "Form submitted",
          description: language === "spanish" ? "¡Gracias por sus comentarios!" : "Thanks for your feedback!",
          status: "success",
        });
        setSubmitted(true);
      } catch (err: unknown) {
        const error = err as Error & { message?: string };
        console.error("Error submitting success story:", err);
        toast({
          title: language === "spanish" ? "Ocurrió un error" : "An error occurred",
          description: language === "spanish" 
            ? `No se pudo crear la respuesta de la historia de éxito: ${error?.message || 'Error desconocido'}`
            : `Success story response was not created: ${error?.message || 'Unknown error occurred'}`,
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
      <IconButton
          aria-label="Back to personal"
          icon={<ChevronLeftIcon boxSize={8} />}
          onClick={() => {
            if (onReview) {
              setOnReview(false);
            } else {
              navigate('/choose-form');
            }
          }}
          colorScheme="blue"
          variant="ghost"
          size="lg"
          position="absolute"
          left={5}
          top={5}
      />
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
            {language === "spanish" ? "Revisar" : "Review"}
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
                {language === "spanish" ? "Cancelar" : "Cancel"}
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
                {language === "spanish" ? "Enviar" : "Submit"}
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
};
