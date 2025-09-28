import { useState } from "react";
import { Checkbox, Flex, Text } from "@chakra-ui/react";

interface HoverCheckboxProps {
  id: number;
  index: number;
  isSelected: boolean;
  onSelectionChange: (id: number, checked: boolean) => void;
  alwaysVisible?: boolean;
}

export const HoverCheckbox = ({
  id,
  index,
  isSelected,
  onSelectionChange,
  alwaysVisible = false,
}: HoverCheckboxProps) => {
  const shouldShowCheckbox = isSelected || alwaysVisible;

  return (
    <Flex
      textAlign={"center"}
      justifyContent={"center"}
      onClick={(e) => e.stopPropagation()}
    >
      {shouldShowCheckbox ? (
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

