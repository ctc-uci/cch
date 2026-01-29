import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Switch,
  Textarea,
  useToast,
  VStack,
  HStack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Children } from "../ViewPage";

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Children | null; // null means adding a new child
  parentId: number;
  onSave: () => void; // callback to refresh the children list
}

const emptyChild: Omit<Children, "id"> = {
  firstName: "",
  lastName: "",
  parentId: 0,
  dateOfBirth: "",
  reunified: false,
  comments: "",
};

export default function ChildModal({
  isOpen,
  onClose,
  child,
  parentId,
  onSave,
}: ChildModalProps) {
  const { backend } = useBackendContext();
  const toast = useToast();
  const [formData, setFormData] = useState<Omit<Children, "id">>(emptyChild);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Delete confirmation dialog
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const isEditing = child !== null;

  useEffect(() => {
    if (isOpen) {
      if (child) {
        // Editing existing child
        setFormData({
          firstName: child.firstName || "",
          lastName: child.lastName || "",
          parentId: child.parentId,
          dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split("T")[0] : "",
          reunified: child.reunified || false,
          comments: child.comments || "",
        });
      } else {
        // Adding new child
        setFormData({
          ...emptyChild,
          parentId: parentId,
        });
      }
    }
  }, [isOpen, child, parentId]);

  const handleChange = (field: keyof Omit<Children, "id">, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!formData.dateOfBirth) {
      toast({
        title: "Validation Error",
        description: "Date of birth is required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && child) {
        // Update existing child
        await backend.put(`/children/${child.id}`, formData);
        toast({
          title: "Child Updated",
          description: "Child information has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new child
        await backend.post("/children", formData);
        toast({
          title: "Child Added",
          description: "New child has been added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data || err.message || "Failed to save child",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!child) return;
    
    setIsDeleting(true);
    try {
      await backend.delete(`/children/${child.id}`);
      toast({
        title: "Child Deleted",
        description: "Child has been removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      onSave();
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data || err.message || "Failed to delete child",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader>
            {isEditing ? "Edit Child" : "Add New Child"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Reunified with Parent</FormLabel>
                <Switch
                  isChecked={formData.reunified}
                  onChange={(e) => handleChange("reunified", e.target.checked)}
                  colorScheme="blue"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Comments</FormLabel>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => handleChange("comments", e.target.value)}
                  placeholder="Enter any additional comments..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3} w="100%" justify="space-between">
              <Box>
                {isEditing && (
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={onDeleteOpen}
                    isLoading={isDeleting}
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <HStack spacing={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  {isEditing ? "Save Changes" : "Add Child"}
                </Button>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Child
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete {child?.firstName} {child?.lastName}? 
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
