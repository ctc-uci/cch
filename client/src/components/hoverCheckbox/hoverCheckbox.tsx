import { useState } from "react";
import { Checkbox, Flex, Text } from "@chakra-ui/react";

interface HoverCheckboxProps {
  clientId: number;
  index: number;
  isSelected: boolean;
  onSelectionChange: (id: number, checked: boolean) => void;
}

export const HoverCheckbox = ({
  clientId,
  index,
  isSelected,
  onSelectionChange,
}: HoverCheckboxProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      textAlign={"center"}
      justifyContent={"center"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {(isHovered || isSelected) ? (
        <Checkbox
          colorScheme="cyan"
          isChecked={isSelected}
          onChange={(e) => onSelectionChange(clientId, e.target.checked)}
        />
      ) : (
        <Text>{index + 1}</Text>
      )}
    </Flex>
  );
};

