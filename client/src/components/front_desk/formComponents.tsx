import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";

type TextInputProps = {
  label?: string;
  name: string;
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
  disabled?: boolean;
  type: "text" | "number" | "email" | "date";
};

export const TextInputComponent = ({
  label,
  name,
  value,
  onChange,
  width = "30%",
  type = "text",
}: TextInputProps) => (
  <FormControl isRequired>
    <HStack>
      {label && <FormLabel w="30%">{label}</FormLabel>}
      <Input
        name={name}
        value={value}
        onChange={onChange}
        w={width}
        type={type}
        required
      />
    </HStack>
  </FormControl>
);

type NumberInputProps = {
  label?: string;
  name: string;
  value: number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: string;
};

export const NumberInputComponent = ({
  label,
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  width = "30%",
}: NumberInputProps) => {
  const handleNumberChange = (valueAsString: string, valueAsNumber: number) => {
    let finalValue = valueAsNumber;
    if (isNaN(valueAsNumber)) {
      finalValue = min; // Default to min if not a number
    } else if (valueAsNumber < min) {
      finalValue = min;
    } else if (valueAsNumber > max) {
      finalValue = max;
    }
    onChange({
      target: {
        name,
        value: finalValue,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  // Convert undefined to empty string or a valid number for the value prop
  const displayValue = value === undefined || isNaN(Number(value)) ? "" : value;

  return (
    <FormControl isRequired>
      <HStack>
        {label && <Text >{label}</Text>}
        <NumberInput
          name={name}
          value={displayValue}
          onChange={handleNumberChange}
          min={min}
          max={max}
          step={step}
          w={width}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </FormControl>
  );
};
type SelectInputProps = {
  label?: string;
  name: string;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { key?: string; label: string; value: string }[];
  placeholder?: string;
  width?: string;
};

export const SelectInputComponent = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select option",
  width = "30%",
}: SelectInputProps) => {
  return (
    <FormControl isRequired>
      <Stack>
      {label && <Text >{label}</Text>}
        <Select
          name={name}
          value={value}
          onChange={onChange}
          w={width}
          placeholder={placeholder}
        >
          {options.map((option) => (
            <option
              key={option.key || option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </Select>
      </Stack>
    </FormControl>
  );
};

type TrueFalseProps = {
  label?: string;
  name: string;
  value: boolean | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  helperText?: string;
};

export const TrueFalseComponent = ({
  label,
  name,
  value,
  onChange,
  width = "30%",
  helperText,
}: TrueFalseProps) => {
  const handleBooleanChange = (newValue: string) => {
    onChange({
      target: {
        name,
        value: newValue === "true",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <FormControl isRequired>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <HStack align="start">
        {label && <FormLabel w="30%">{label}</FormLabel>}
        <RadioGroup
          name={name}
          value={value !== undefined ? value.toString() : ""}
          onChange={handleBooleanChange}
          w={width}
        >
          <HStack
            spacing="24px"
            wrap="wrap"
          >
            <Radio value="true">Yes</Radio>
            <Radio value="false">No</Radio>
          </HStack>
        </RadioGroup>
      </HStack>
    </FormControl>
  );
};
