import React, { useState, useMemo } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  Divider,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { FaPlus } from "react-icons/fa";

type Props = {
  donors: string[];
  donor: string;
  setDonor: (d: string) => void;
  newDonor: string;
  setNewDonor: (n: string) => void;

  addDonor: (name: string) => Promise<void>;
};

export function DonationFilter({
  donors,
  donor,
  setDonor,
  newDonor,
  setNewDonor,
  handleAddDonor,
}: {
  donors: string[];
  donor: string;
  setDonor: (d: string) => void;
  newDonor: string;
  setNewDonor: (n: string) => void;
  handleAddDonor: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState("");
  const filtered = useMemo(
    () =>
      donors.filter((d) =>
        typeof d === "string" &&
          d.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [donors, searchTerm]
  );

  const selectDonor = (d: string) => {
    setDonor(d);
    onClose();
  };

  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={() => {
        onClose();
        onAddClose();
        setSearchTerm("");
      }}
      closeOnBlur
      closeOnSelect={false}
    >
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
        w="300px"
        textAlign="left"
      >
        {donor || "Select Donor"}
      </MenuButton>

      <MenuList w="300px" p={2} boxShadow="md">
        <InputGroup mb={2}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search donor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <VStack align="stretch" spacing={0} maxH="100vh" overflowY="auto">
          {filtered.map((d) => (
            <MenuItem key={d} onClick={() => selectDonor(d)}>
              {d}
            </MenuItem>
          ))}
          {filtered.length === 0 && (
            <Text px={2} color="gray.500" fontSize="sm">
              No donors found
            </Text>
          )}
        </VStack>

        <Divider my={2} />

        {!isAddOpen && (
          <MenuItem
            icon={<FaPlus color="gray" />}
            onClick={onAddOpen}
            color="gray.600"
          >
            Add New Donor
          </MenuItem>
        )}

        {isAddOpen && (
          <HStack px={2} py={1}>
            <Input
              placeholder="New donor name"
              value={newDonor}
              onChange={(e) => setNewDonor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddDonor();
                if (e.key === "Escape") onAddClose();
              }}
            />
            <IconButton
              aria-label="Confirm add donor"
              icon={<FaPlus />}
              size="sm"
              onClick={handleAddDonor}
            />
          </HStack>
        )}
      </MenuList>
    </Menu>
  );
}