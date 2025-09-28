import { useEffect, useState } from "react";


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

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  notes: string;
}

type LocationOption = {
  label: string;
  value: string;
};

type Location = {
  id: number;
  cm_id: number;
  name: string;
  date: Date;
  caloptima_funded: boolean;
};

const AddPreview = ({
                      userType,
                      isOpen,
                      onClose,
                    }: {
  userType: RoleKey;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();

  const [locationOptions, setLocationOption] = useState<LocationOption[]>([]);
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
        cms: "case_manager",
        clients: "client"
      };

      if (roleDict[userType] === "client") {
        return;
      }

      for (const value of Object.values(newUser)) {
        if (value === "") {
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

        const cmResponse = await backend.post(`/caseManagers`, {
          role: roleDict[userType],
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
          notes: newUser.notes
        });
        
        const cm_id = cmResponse.data[0].id;

        await backend.post(`/locations`, {
          cmId: cm_id,
          name: newUser.location,
          date: new Date(),
          caloptimaFunded: false,
        });


        onClose();

        toast({
          title: `${title} Added`,
          description: `${newUser.firstName} ${newUser.lastName} has been added!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        
        window.location.reload();
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

    useEffect(() => {
      const getLocations = async () => {
        try {
          const response = await backend.get("/locations");
          const locationOptions: LocationOption[] = [];

          response.data.forEach((location: Location) => {
            locationOptions.push({
              label: location.name,
              value: location.name,
            });
          });

          setLocationOption(locationOptions);
        } catch (e) {
          console.error(`something went wrong ${e}`);
        }
      };

      getLocations();
    }, [backend, setLocationOption]);

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
                  <Tr>
                    <Td fontSize="medium">First Name</Td>
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
                    <Td fontSize="medium">Last Name</Td>
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
                  <Tr>
                    <Td fontSize="medium">Email</Td>
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
                  <Tr>
                    <Td fontSize="medium">Location</Td>
                    <Td>
                      <SelectInputComponent
                        name="location"
                        value={newUser.location}
                        onChange={handleChange}
                        options={locationOptions}
                        width="100%"
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontSize="medium">Phone</Td>
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
