import { useEffect, useState } from "react";

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
import {SuccessStoryForm} from "./SuccessStoryForm";

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

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
  };

  return (
    <SuccessStoryForm onSubmit={handleSubmit} />
  );
};