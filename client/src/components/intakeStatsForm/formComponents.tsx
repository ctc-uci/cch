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
} from "@chakra-ui/react";

type TextInputProps = {
  label: string;
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
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
      <FormLabel w="30%">{label}</FormLabel>
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
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
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
  const handleChange = (valueAsString: string, valueAsNumber: number) => {
    // Ensure the value stays within the min and max range
    if (valueAsNumber < min) {
      onChange(min);
    } else if (valueAsNumber > max) {
      onChange(max);
    } else {
      onChange(valueAsNumber);
    }
  };

  return (
    <FormControl isRequired>
      <HStack>
        <FormLabel w="30%">{label}</FormLabel>
        <NumberInput
          name={name}
          value={value || min}
          onChange={handleChange}
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
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { key?: string, label: string; value: string }[];
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
      <HStack>
        <FormLabel w="30%">{label}</FormLabel>
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
      </HStack>
    </FormControl>
  );
};


type TrueFalseProps = {
  label: string;
  name: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
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
  const handleChange = (newValue: string) => {
    onChange(newValue === "true");
  };

  return (
    <FormControl isRequired>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <HStack align="start">
        <FormLabel w="30%">{label}</FormLabel>
        <RadioGroup
          name={name}
          value={value !== undefined ? value.toString() : ""}
          onChange={handleChange}
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
