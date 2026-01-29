import { Box, Heading, Stack } from "@chakra-ui/react";

import { EditFormPreview } from "./editFormPreview";
import { EditFormSelector } from "./editFormSelector";
import { FormType } from "../../types/form";
import { useState } from "react";

export const EditFormPage = () => {
  const [formType, setFormType] = useState<FormType | null>(null);
  return (
    <Stack
      overflowX="hidden"
      p="2% 4%"
    >
      <Stack
        direction="column"
        gap={4}
      >
        <Heading
          as="h1"
          size="xl"
          mb={8}
        >
          Choose a Form to Edit
        </Heading>
        <Stack
          direction={["column", "column", "row"]}
          spacing={4}
          width="100%"
          alignItems={["stretch", "stretch", "flex-start"]}
        >
          <EditFormSelector formType={formType} setFormType={setFormType} />
          <Box width={["100%", "100%", "auto"]} flex={["none", "none", "1"]}>
            <EditFormPreview formType={formType} />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default EditFormPage;
