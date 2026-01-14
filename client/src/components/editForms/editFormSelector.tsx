import { Button, Flex, Grid, Heading, Stack } from "@chakra-ui/react";
import { FormType } from "../../types/form";
import { useState } from "react";

export const EditFormSelector = ({ formType, setFormType }: { formType: FormType | null, setFormType: (formType: FormType) => void }) => {
  return (
      <Flex
        flexDirection="column"
        gap={4}
      >
        <Button
          variant={formType === "Initial Screeners" ? "solid" : "outline"}
          colorScheme="blue"
          width="400px"
          onClick={() => setFormType("Initial Screeners")}
        >
          Initial Screener Form
        </Button>
        <Button
          variant={formType === "Exit Surveys" ? "solid" : "outline"}
          colorScheme="blue"
          width="400px"
          onClick={() => setFormType("Exit Surveys")}
        >
          Exit Survey Form
        </Button>
        <Button
          variant={formType === "Success Stories" ? "solid" : "outline"}
          colorScheme="blue"
          width="400px"
          onClick={() => setFormType("Success Stories")}
        >
          Success Story Form
        </Button>
        <Button
          variant={formType === "Random Client Surveys" ? "solid" : "outline"}
          colorScheme="blue"
          width="400px"
          onClick={() => setFormType("Random Client Surveys")}
        >
          Random Client Survey Form
        </Button>
      </Flex>
  );
};
