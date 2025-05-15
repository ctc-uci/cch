import { useState } from "react";

import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  Textarea,
  useDisclosure, useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import { ConfirmEmailModal } from "./ConfirmEmailModal.tsx";
import { Person, RoleKey } from "./ManageAccounts";

export const UserInfoSlide = ({
  user,
  userType,
  onClose,
}: {
  user: Person;
  userType: RoleKey;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();

  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user.email);

  const toast = useToast();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const userTypeName = {
    admin: "Administrator",
    cms: "Case Manager",
    clients: "Client",
  };

  const title = userTypeName[userType];

  const handleSubmitEmailChange = async () => {
    try {
      const roleDict = {
        admin: "admin",
        cms: "case manager",
        clients: "client"
      };

      if (roleDict[userType] === "client") {
        return;
      }

      await backend.put(`/caseManagers/${user.id}`, {
        role: roleDict[userType],
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: email,
      });

      user.email = email;

      toast({
        title: `${title} Data Saved`,
        description: `Successfully Saved!`,
        status: "info",
        duration: 9000,
        isClosable: true,
      });

      setEditingEmail(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      bg="white"
      w="100%"
      h="90%"
      p="15px"
      borderRadius="12px"
      border="1px solid var(--gray-200, #E2E8F0)"
    >
      <IconButton
        icon={<ArrowBackIcon />}
        onClick={() => {
          if (editingEmail) {
            setEditingEmail(false);
          } else {
            onClose();
          }
        }}
        aria-label="Back"
        mb={6}
        variant="ghost"
      />

      {!editingEmail ? (
        <VStack
          align="flex-start"
          spacing={10}
          pl={10}
        >
          <VStack spacing={4}>
            <HStack
              p="20px"
              align="center"
              borderRadius="12px"
              border="1px solid var(--gray-200, #E2E8F0)"
              bg="var(--white, #FFF)"
            >
              <VStack
                align="flex-start"
                width="150px"
                color="#2D3748"
                fontSize="14px"
                fontWeight="700"
                lineHeight="20px"
              >
                <Text>NAME</Text>
                <Text>EMAIL</Text>
                <Text>ROLE</Text>
                <Text>LOCATION</Text>
              </VStack>
              <VStack
                align="flex-start"
                color="#2D3748"
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
              >
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
                <Text>{user.email}</Text>
                <Text>{title}</Text>
                <Text>{user.location}</Text>
              </VStack>
            </HStack>

            <HStack
              width="40%"
              justify="center"
            >
              <Button
                color="var(--blue-500, #3182CE)"
                variant="ghost"
                _hover={{
                  background: "transparent",
                  color: "inherit",
                }}
                onClick={() => setEditingEmail(true)}
              >
                <EditIcon />
                <Text
                  fontSize="12px"
                  fontStyle="normal"
                  fontWeight="600"
                  lineHeight="16px"
                >
                  Edit {title} Email
                </Text>
              </Button>
            </HStack>
          </VStack>

          {/* Notes Section */}
          <VStack
            width="380px"
            align="flex-start"
          >
            <Text>Notes:</Text>
            <Textarea size="md" >{user.notes}</Textarea>
          </VStack>
        </VStack>
      ) : (
        <VStack
          align="flex-start"
          spacing={10}
          pl={10}
          pr={10}
        >
          {/* Email Edit Mode */}
          <VStack
            borderRadius="12px"
            border="1px solid"
            borderColor="gray.200"
            width="100%"
            align="flex-start"
            padding="30px"
          >
            <Text
              fontWeight="bold"
              mb={4}
            >
              Edit Email
            </Text>
            <HStack width="100%">
              <Text mr="40px">EMAIL</Text>
              <VStack
                width="100%"
                alignItems="flex-start"
              >
                <Input
                  width="80%"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </VStack>
            </HStack>
          </VStack>

          <Flex
            width="100%"
            justifyContent="flex-end"
          >
            <Button
              colorScheme="blue"
              onClick={openModal}
            >
              Confirm Changes
            </Button>
          </Flex>

          <ConfirmEmailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            email={user.email}
            onSubmit={handleSubmitEmailChange}
          />
        </VStack>
      )}
    </Box>
  );
};
