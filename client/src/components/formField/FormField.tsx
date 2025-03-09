import { FormControl, FormLabel, HStack } from '@chakra-ui/react';

interface FormFieldProps {
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
}

export const FormField = ({ label, isRequired, children }: FormFieldProps) => (
  <FormControl isRequired={isRequired}>
    <HStack
      justify="space-between"
      align="center"
      width="100%"
    >
      <FormLabel margin="0">{label}</FormLabel>
      {children}
    </HStack>
  </FormControl>
);
