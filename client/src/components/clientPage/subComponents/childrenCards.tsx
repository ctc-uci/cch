import { useState, useEffect } from "react";
import {
  Box,
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
  Button,
} from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import toSnakeCase from "../../utils/snakeCase";
import image from "./pfp.jpeg";
import { Children } from "./ViewPage";

interface ChildrenProps {
  items: Children[];
}

function ChildrenCards({ items }: ChildrenProps) {
  const { backend } = useBackendContext();

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

  const handleSave = async (childId: number) => {
    const comment = editedComments[childId];
    if (comment === originalComments[childId]) return;

    const updatedData = toSnakeCase({ comment });
    try {
      await backend.put(`/children/${childId}`, updatedData);

      setOriginalComments((prev) => ({
        ...prev,
        [childId]: comment,
      }));
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (!items || items.length === 0) {
    return (
      <Flex align="center" justify="center" minH="300px" p={6}>
        <Heading size="md">No Children Registered</Heading>
      </Flex>
    );
  }

  return (
    <Stack flexDirection="row" spacing="5vh" p={6}>
      {items.map((item) => {
        const isChanged = editedComments[item.id] !== originalComments[item.id];
        return (
          <Card key={item.id} overflow="hidden" boxShadow="md" w="320px">
            <CardHeader>
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
            </CardHeader>
            <CardBody>
              <Stack spacing={2}>
                <Box>
                  <Text as="span" fontWeight="semibold">
                    Custody:
                  </Text>{" "}
                  <Text as="span" color="gray.700">
                    {item.custody ?? "N/A"}
                  </Text>
                </Box>
                <Box>
                  <Text as="span" fontWeight="semibold">
                    School:
                  </Text>{" "}
                  <Text as="span" color="gray.700">
                    {item.school ?? "N/A"}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
            <CardFooter>
              <Stack w="100%" spacing={2}>
                <Text>Comments</Text>
                <Textarea
                  height="100px"
                  placeholder="Enter comment"
                  value={editedComments[item.id] || ""}
                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                />
                <Flex justify="flex-end">
                  <Button
                    onClick={() => handleSave(item.id)}
                    colorScheme="blue"
                    isDisabled={!isChanged}
                  >
                    Save
                  </Button>
                </Flex>
              </Stack>
            </CardFooter>
          </Card>
        );
      })}
    </Stack>
  );
}

export default ChildrenCards;
