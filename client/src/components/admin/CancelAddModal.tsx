import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  Flex,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void | Promise<void>;
}

export const CancelAddModal = ({ isOpen, onClose, title, onSubmit } : ModalProps) => {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="lg">
          <ModalCloseButton top={4} right={4} />

          <AlertDialogHeader
            fontSize="xl"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            gap={2}
          >
            Cancel Adding New {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Flex mb={3}>
              <Text>Are you sure? You can't undo this action afterwards.</Text>
            </Flex>
          </AlertDialogBody>

          <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                bg="gray.100"
                _hover={{ bg: "gray.200" }}
                mr={3}
                px={8}
                py={6}
                fontWeight="bold"
                borderRadius="lg"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onSubmit();
                  onClose();
                }}
                px={8}
                py={6}
                fontWeight="bold"
                borderRadius="lg"
              >
                Yes
              </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
