import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex, HStack,
  Input,
  Stack,
  Text, useDisclosure,
  useToast,
} from "@chakra-ui/react";

import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {ConfirmChangesModal} from "./ConfirmChangesModal.tsx";
import { DeleteUserModal } from "../admin/DeleteUserModal.tsx";

type EditClientProps = { 
  email: string; 
  setClientModal: (open: boolean) => void;
  onClientDeleted?: (deletedEmail: string) => void;
};
type ClientUser = {
  id: number;
  email: string;
  firebaseUid?: string;
  [key: string]: unknown;
};

export default function EditClient({ email, setClientModal, onClientDeleted }: EditClientProps) {
  const { backend } = useBackendContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const auth = getAuth();
  const toast = useToast();

  const [user, setUser] = useState<ClientUser | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, _setFormData] = useState<Record<string, unknown>>({});

  const handleDelete = async () => {
    try {
      // delete client record
      if (!user) return;
      await backend.delete(`/clients/${user.id}`);
      // delete corresponding user by email (also deletes Firebase if linked on server)
      await backend.delete(`/users/email/${encodeURIComponent(user.email)}`);
      toast({
        title: "Client Deleted",
        description: "The client account has been removed.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      // Notify parent component to update the persons grid
      if (onClientDeleted) {
        onClientDeleted(user.email);
      }
      setClientModal(false);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting this client.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`/clients/email/${email}`);

        setUser(response.data[0] as ClientUser);
      } catch (_error) {
        console.error("Error fetching data:", _error);
      }
    };
    fetchData();
  }, [backend, email]);

  const handlePasswordChange = async () => {
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }
    try {
      if (!user) {
        return;
      }
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (_error) {
      toast({
        title: "Password update failed",
        description: "Failed to update password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password update failed",
        description: "Failed to update password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const handleSaveChanges = async () => {
    if (
      passwordData.newPassword &&
      passwordData.newPassword === passwordData.confirmPassword
    ) {
      await handlePasswordChange();
    }
    try {
      if (!user) return;
      // console.log("Sending request: ", {
      //   ...formData,
      //   firebaseUid: user.firebaseUid,
      // });
      const response = await backend.put("/users/update", {
        ...formData,
        firebaseUid: user.firebaseUid,
      });
      const updatedUser = await response.data;
      setUser(updatedUser);
      toast({
        position: "bottom-right",
        title: "Successfully Saved Changes.",
        description: Date().toLocaleString(),
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating user",
        description: "An error occurred while saving your changes.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  // if (isLoading) { return <>Loading...</> }

  // if (!user) { return <>User not found</> }

  return (
    user && (
      <Box
        p={5}
        borderRadius="md"
        boxShadow="md"
        bg="white"
        borderColor="gray.100"
        borderWidth="1px"
        width="100%"
      >
        <Text
          fontSize="sm"
          fontWeight="bold"
        >
          Edit Information - Account
        </Text>
        <Stack padding={"5rem"}>
          <Stack>
            <Flex
              alignItems={"center"}
              gap={"4.5rem"}
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                color="gray.500"
              >
                EMAIL
              </Text>

              <Stack width="100%">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="gray.600"
                >
                  Email
                </Text>
                {user && <Input
                  placeholder="Email"
                  defaultValue={user.email}
                  name="email"
                />}
              </Stack>
            </Flex>
          </Stack>

          <Stack>
            <Flex
              alignItems={"center"}
              gap={"2rem"}
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                color="gray.500"
              >
                PASSWORD
              </Text>
              <Stack width="100%">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="gray.600"
                >
                  Current Password
                </Text>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="gray.600"
                >
                  New Password
                </Text>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="gray.600"
                >
                  Confirm Password
                </Text>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Stack>
            </Flex>
          </Stack>
        </Stack>
        <HStack
          justifyContent="right"
        >
          <Button
            onClick={() => {
              setClientModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={deleteOnOpen}
          >
            Delete Profile
          </Button>
          <Button
            colorScheme="blue"
            onClick={onOpen}
          >
            Confirm Changes
          </Button>
        </HStack>

        <ConfirmChangesModal
          isOpen={isOpen}
          onClose={onClose}
          email={user ? user.email : ""}
          password={passwordData.newPassword}
          onSubmit={handleSaveChanges}
        />
        <DeleteUserModal
          isOpen={deleteIsOpen}
          onClose={deleteOnClose}
          title="Client"
          onSubmit={handleDelete}
        />
      </Box>
    )
  );
}
