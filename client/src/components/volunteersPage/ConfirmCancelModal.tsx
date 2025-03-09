import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface ConfirmCancelModalProps {
  isEditMode: boolean;
  isConfirmOpen: boolean;
  onConfirmClose: () => void;
  onDrawerClose: () => void;
}

const ConfirmCancelModal = ({
  isEditMode: isEditMode,
  isConfirmOpen,
  onConfirmClose,
  onDrawerClose,
}: ConfirmCancelModalProps) => {
  return (
    <>
      <Modal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Cancel Edits" : "Cancel Adding New Volunteer"}
          </ModalHeader>
          <ModalBody>
            {isEditMode
              ? "Are you sure? Your edits will not be saved."
              : "Are you sure? You can't undo this action afterwards."}
          </ModalBody>
          <ModalCloseButton />
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={onConfirmClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                onConfirmClose();
                onDrawerClose();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmCancelModal;
