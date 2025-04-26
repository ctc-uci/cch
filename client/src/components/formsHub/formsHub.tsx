import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { FormTable } from "./formsTable";
import { StartForms } from "./startForm";
import { FormPreview } from "./FormPreview";
import { useState } from "react";
import { Form } from "../../types/form";

interface FormsHubProps {
  admin?: boolean;
}

export const FormsHub = ({admin}: FormsHubProps) => {
  console.log("forms hub is being rendered")
  return (

    <VStack
      overflowX="hidden"
      spacing={8}
      align="stretch"
      width="100%"
    >
      <Box>
        <Heading
          p={6}
          as="h1"
          size="xl"
          mb={2}
        >
          Forms
        </Heading>
      </Box>
      {admin || (
        <>
          <Text
            fontWeight="bold"
            px={6}
            fontSize="lg"
          >
            Start a Form
          </Text>
          <StartForms />
        </>
      )}
      <Box px={8}>
        <FormTable
        // clickedFormItem={clickedFormItem}
        // setClickedFormItem={setClickedFormItem}
        // onOpen={handleOpen}
      />
      {/* {clickedFormItem && (
        <FormPreview
          formItemId={clickedFormItem.id}
          formItemTitle={clickedFormItem.title}
          formItemName={clickedFormItem.name}
          formItemDate={clickedFormItem.date}
          isOpen={isOpen}
          onClose={handleClose}
        />
      )} */}
      </Box>
    </VStack>
  );
};
