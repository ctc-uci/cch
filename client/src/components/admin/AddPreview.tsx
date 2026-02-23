import { useState } from "react";


import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  HStack,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr, useDisclosure,
  useToast,
} from "@chakra-ui/react";


import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import { SelectInputComponent, TextInputComponent } from "../intakeStatsForm/formComponents.tsx";
import { RoleKey } from "./ManageAccounts.tsx";
import { CancelAddModal } from "./CancelAddModal.tsx";
import { LOCATION_OPTIONS } from "../../constants/locations";

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  notes: string;
}

const AddPreview = ({
                      userType,
                      isOpen,
                      onClose,
                      onUserAdded,
                      existingEmails,
                    }: {
  userType: RoleKey;
  isOpen: boolean;
  onClose: () => void;
  onUserAdded?: (newUser: UserInfo & { id: number }) => void;
  existingEmails?: string[];
}) => {
  const { backend } = useBackendContext();

  const [newUser, setNewUser] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    notes: ""
  });
  const toast = useToast();

  const userTypeName = {
    admin: "Admin",
    cms: "Case Manager",
    clients: "Client",
  };

  const title = userTypeName[userType];

  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose
  } = useDisclosure();

  const submitUser = async () => {
    try {
      const roleDict = {
        admin: "admin",
        cms: "case manager",
        clients: "client"
      };

      // For clients, only email is required
      if (roleDict[userType] === "client") {
        if (!newUser.email || newUser.email === "") {
          toast({
            title: `Missing Information`,
            description: `Email is required.`,
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
          return;
        }

        // Check for duplicate email in existing list (all admins, case managers, and clients)
        if (
          existingEmails &&
          existingEmails.some(
            (email) => email.toLowerCase() === newUser.email.toLowerCase()
          )
        ) {
          toast({
            title: `Duplicate Email`,
            description: `A user with email ${newUser.email} already exists (as an admin, case manager, or client).`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        }

        // Create client user account
        try {
          const userResponse = await backend.post("/users/create", {
            email: newUser.email,
            role: roleDict[userType],
            firstName: null,
            lastName: null,
            phoneNumber: null,
          });

          const createdUser = userResponse.data[0] || userResponse.data;

          // Add the new user to local state
          if (onUserAdded) {
            onUserAdded({
              id: createdUser.id || 0,
              firstName: createdUser.firstName || "",
              lastName: createdUser.lastName || "",
              email: createdUser.email || newUser.email,
              phoneNumber: createdUser.phoneNumber || "",
              location: "",
              notes: "",
            });
          }

          onClose();

          toast({
            title: `${title} Added`,
            description: `Client account for ${newUser.email} has been added!`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });

          return;
        } catch (e: unknown) {
          console.error(e);
          
          // Check if it's a duplicate email error
          const error = e as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
          const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;
          const isDuplicateError = errorMessage?.toLowerCase().includes('duplicate') || 
                                  errorMessage?.toLowerCase().includes('already exists') ||
                                  error?.response?.status === 400;

          toast({
            title: `${title} Not Added`,
            description: isDuplicateError 
              ? (errorMessage || `A ${title.toLowerCase()} with this email already exists.`)
              : `An error occurred and the ${title.toLowerCase()} was not added`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        }
      }

      for (const [key, value] of Object.entries(newUser)) {
        if (key !== "notes" && value === "") {
          toast({
            title: `Missing Information`,
            description: `There is a missing or incorrect field.`,
            status: "warning",
            duration: 9000,
            isClosable: true,
          });

          return;
        }
      }

      // Check for duplicate email in existing list
      if (existingEmails && existingEmails.some(email => email.toLowerCase() === newUser.email.toLowerCase())) {
        toast({
          title: `Duplicate Email`,
          description: `A ${title.toLowerCase()} with email ${newUser.email} already exists.`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

        try {
          const cmResponse = await backend.post(`/caseManagers`, {
            role: roleDict[userType],
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phoneNumber: newUser.phoneNumber,
            email: newUser.email,
            notes: newUser.notes,
            location: newUser.location || null,
          });

          const cm_id = cmResponse.data[0].id;

          // Create user account
          try {
            if (roleDict[userType] === "admin") {
              await backend.post("/users/invite", {
                email: newUser.email,
                role: "admin",
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phoneNumber: newUser.phoneNumber,
              });
            }
            else if (roleDict[userType] === "case manager") {
              await backend.post("/users/create", {
                email: newUser.email,
                role: "user",
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phoneNumber: newUser.phoneNumber,
              });
            }
          } catch (e: unknown) {
            console.error("Error creating user account:", e);
            
            // If user creation fails due to duplicate, show error but don't fail the whole operation
            // since case manager was already created
            const error = e as { response?: { data?: { message?: string; error?: string } }; message?: string };
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;
            const isDuplicateError = errorMessage?.toLowerCase().includes('duplicate') || 
                                    errorMessage?.toLowerCase().includes('already exists');
            
            if (isDuplicateError) {
              toast({
                title: "User Account Warning",
                description: errorMessage || "Case manager was created but user account already exists.",
                status: "warning",
                duration: 9000,
                isClosable: true,
              });
            }
          }

          // Add the new user to local state with all required fields
          if (onUserAdded) {
            onUserAdded({
              id: cm_id,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              phoneNumber: newUser.phoneNumber,
              location: newUser.location,
              notes: newUser.notes || "",
            });
          }

          onClose();

          toast({
            title: `${title} Added`,
            description: `${newUser.firstName} ${newUser.lastName} has been added!`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        
        } catch (e: unknown) {
          console.error(e);

          // Check if it's a duplicate email error
          const error = e as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
          const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;
          const isDuplicateError = errorMessage?.toLowerCase().includes('duplicate') || 
                                  errorMessage?.toLowerCase().includes('already exists') ||
                                  error?.response?.status === 400;

          toast({
            title: `${title} Not Added`,
            description: isDuplicateError 
              ? (errorMessage || `A ${title.toLowerCase()} with this email already exists.`)
              : `An error occurred and the ${title.toLowerCase()} was not added`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (e) {
        console.error(e);

        toast({
          title: `${title} Not Added`,
          description: `An error occurred and the ${title.toLowerCase()} was not added`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;

      if (name === "firstName") {
        setNewUser((prev) => ({
          ...prev,
          firstName: value,
        }));

        return;
      }

      if (name === "lastName") {
        setNewUser((prev) => ({
          ...prev,
          lastName: value,
        }));

        return;
      }

      setNewUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              <IconButton
                as={ChevronRightIcon}
                color="blue.500"
                aria-label="Close drawer"
                onClick={modalOnOpen}
                variant="ghost"
                size="sm"
              />
              <Text fontSize="md">Add {title}</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody
            display="flex"
            flexDirection="column"
            h="100%"
          >
            <TableContainer
              flex="1"
              w="100%"
              border="1px"
              borderColor="gray.200"
              borderRadius="12px"
              overflowY="auto"
            >
              <Table variant="simple">
                <Tbody>
                  {userType !== "clients" && (
                    <>
                      <Tr>
                        <Td fontSize="medium">First Name <Text as="span" color="red">*</Text></Td>
                        <Td>
                          <TextInputComponent
                            name="firstName"
                            type="text"
                            value={`${newUser.firstName}`}
                            onChange={handleChange}
                            width="100%"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="medium">Last Name <Text as="span" color="red">*</Text></Td>
                        <Td>
                          <TextInputComponent
                            name="lastName"
                            type="text"
                            value={`${newUser.lastName}`}
                            onChange={handleChange}
                            width="100%"
                          />
                        </Td>
                      </Tr>
                    </>
                  )}
                  <Tr>
                    <Td fontSize="medium">Email <Text as="span" color="red">*</Text></Td>
                    <Td>
                      <TextInputComponent
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={handleChange}
                        width="100%"
                      />
                    </Td>
                  </Tr>
                  {userType !== "clients" && (
                    <>
                      <Tr>
                        <Td fontSize="medium">Location <Text as="span" color="red">*</Text></Td>
                        <Td>
                          <SelectInputComponent
                            name="location"
                            value={newUser.location}
                            onChange={handleChange}
                            options={LOCATION_OPTIONS.map((name) => ({ label: name, value: name }))}
                            width="100%"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="medium">Phone <Text as="span" color="red">*</Text></Td>
                        <Td>
                          <TextInputComponent
                            name="phoneNumber"
                            type="number"
                            value={newUser.phoneNumber}
                            onChange={handleChange}
                            width="100%"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize="medium">Notes</Td>
                        <Td>
                          <TextInputComponent
                            name="notes"
                            type="text"
                            value={newUser.notes}
                            onChange={handleChange}
                            width="100%"
                          />
                        </Td>
                      </Tr>
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            <HStack
              mt={4}
              spacing={3}
              w="100%"
              justifyContent="flex-end"
            >
              <Button onClick={modalOnOpen}>Cancel</Button>
              <Button colorScheme="blue" onClick={submitUser} >Save</Button>
            </HStack>
          </DrawerBody>

          <CancelAddModal
            isOpen={modalIsOpen}
            onClose={modalOnClose}
            title={title}
            onSubmit={onClose}
          />
        </DrawerContent>
      </Drawer>
    );
  };

  export default AddPreview;
