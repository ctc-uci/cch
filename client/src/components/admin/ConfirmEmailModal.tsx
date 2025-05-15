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
  Icon, ModalCloseButton,
} from "@chakra-ui/react";
import { useRef } from "react";
import { MdEdit } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSubmit: () => void | Promise<void>;
}

export const ConfirmEmailModal = ({ isOpen, onClose, email, onSubmit } : ModalProps) => {
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
            <Icon as={MdEdit} />
            Confirm Changes
          </AlertDialogHeader>

          <AlertDialogBody>
            <Flex mb={3}>
              <Text fontWeight="bold" color="gray.500" w="120px">
                EMAIL
              </Text>
              <Text>{email}</Text>
            </Flex>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Flex width="100%">
              <Button
                ref={cancelRef}
                onClick={onClose}
                bg="gray.100"
                _hover={{ bg: "gray.200" }}
                mr={3}
                px={8}
                py={6}
                flex={1}
                fontWeight="bold"
                borderRadius="lg"
              >
                Back
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onSubmit();
                  onClose();
                }}
                px={8}
                py={6}
                flex={1}
                fontWeight="bold"
                borderRadius="lg"
              >
                Submit
              </Button>
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
