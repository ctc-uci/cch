import { useState } from "react";
import { Checkbox, Flex, Text } from "@chakra-ui/react";

interface HoverCheckboxProps {
  id: number;
  index: number;
  isSelected: boolean;
  onSelectionChange: (id: number, checked: boolean) => void;
}

export const HoverCheckbox = ({
  id,
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
          isChecked={isSelected}
          onChange={(e) => onSelectionChange(id, e.target.checked)}
        />
      ) : (
        <Text>{index + 1}</Text>
      )}
    </Flex>
  );
};

