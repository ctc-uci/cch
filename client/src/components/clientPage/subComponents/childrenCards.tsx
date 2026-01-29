import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import image from "../pfp.jpeg";
import { Children } from "../ViewPage";
import ChildModal from "../editFormModals/ChildModal";

interface ChildrenProps {
  items: Children[];
  parentId: number;
  onRefresh: () => void;
}

function ChildrenCards({ items, parentId, onRefresh }: ChildrenProps) {
  const { backend } = useBackendContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [selectedChild, setSelectedChild] = useState<Children | null>(null);
  const [editedComments, setEditedComments] = useState<{ [key: number]: string }>({});
  const [originalComments, setOriginalComments] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const initialComments: { [key: number]: string } = {};
    items.forEach((child) => {
      initialComments[child.id] = child.comments || "";
    });
    setEditedComments(initialComments);
    setOriginalComments(initialComments);
  }, [items]);

  const handleCommentChange = (childId: number, newComment: string) => {
    setEditedComments((prev) => ({
      ...prev,
      [childId]: newComment,
    }));
  };

  const handleSaveComment = async (childId: number) => {
    const comment = editedComments[childId] ?? "";
    if (comment === originalComments[childId]) return;

    try {
      await backend.put(`/children/${childId}`, { comments: comment });
      setOriginalComments((prev) => ({
        ...prev,
        [childId]: comment,
      }));
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleAddChild = () => {
    setSelectedChild(null);
    onOpen();
  };

  const handleEditChild = (child: Children) => {
    setSelectedChild(child);
    onOpen();
  };

  const handleModalClose = () => {
    setSelectedChild(null);
    onClose();
  };

  const handleModalSave = () => {
    onRefresh();
  };

  return (
    <>
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Children ({items.length})</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleAddChild}
            size="sm"
          >
            Add Child
          </Button>
        </Flex>

        {items.length === 0 ? (
          <Flex 
            align="center" 
            justify="center" 
            minH="200px" 
            border="2px dashed" 
            borderColor="gray.200" 
            borderRadius="md"
            flexDirection="column"
            gap={4}
          >
            <Text color="gray.500">No children registered for this client</Text>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={handleAddChild}
            >
              Add First Child
            </Button>
          </Flex>
        ) : (
          <Stack flexDirection="row" flexWrap="wrap" gap={5}>
            {items.map((item) => {
              const isChanged = editedComments[item.id] !== originalComments[item.id];
              return (
                <Card key={item.id} overflow="hidden" boxShadow="md" w="320px">
                  <CardHeader pb={2}>
                    <Flex justify="space-between" align="flex-start">
                      <HStack spacing={4}>
                        <Image
                          boxSize="60px"
                          objectFit="cover"
                          borderRadius="full"
                          src={image}
                          alt={`${item.firstName} ${item.lastName}`}
                        />
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="md" fontWeight="bold">
                            {item.firstName} {item.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            DOB:{" "}
                            {new Date(item.dateOfBirth).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "2-digit",
                            })}
                          </Text>
                        </VStack>
                      </HStack>
                      <IconButton
                        aria-label="Edit child"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditChild(item)}
                      />
                    </Flex>
                  </CardHeader>
                  <CardBody py={2}>
                    <Stack spacing={2}>
                      <Box>
                        <Text as="span" fontWeight="semibold">
                          Reunified:
                        </Text>{" "}
                        <Badge colorScheme={item.reunified ? "green" : "gray"}>
                          {item.reunified ? "Yes" : "No"}
                        </Badge>
                      </Box>
                    </Stack>
                  </CardBody>
                  <CardFooter pt={2}>
                    <Stack w="100%" spacing={2}>
                      <Text fontWeight="semibold" fontSize="sm">Comments</Text>
                      <Textarea
                        height="80px"
                        placeholder="Enter comment"
                        value={editedComments[item.id] || ""}
                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        fontSize="sm"
                      />
                      <Flex justify="flex-end">
                        <Button
                          onClick={() => handleSaveComment(item.id)}
                          colorScheme="blue"
                          size="sm"
                          isDisabled={!isChanged}
                        >
                          Save Comment
                        </Button>
                      </Flex>
                    </Stack>
                  </CardFooter>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>

      <ChildModal
        isOpen={isOpen}
        onClose={handleModalClose}
        child={selectedChild}
        parentId={parentId}
        onSave={handleModalSave}
      />
    </>
  );
}

export default ChildrenCards;
