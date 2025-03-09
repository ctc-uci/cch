import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

interface DeleteRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteRowModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteRowModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>"Confirm Deletion"</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {
              "Are you sure you want to delete? This action is irreversible."}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
