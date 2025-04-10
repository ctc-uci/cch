import { useState } from "react";

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
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
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

  // State to store comments per child
  const [comments, setComments] = useState<{ [key: number]: string }>({});

  // Handle input change
  const handleCommentChange = (childId: number, newComment: string) => {
    setComments((prevComments) => ({
      ...prevComments,
      [childId]: newComment,
    }));
  };

  // Save changes for a specific child
  const handleSaveChanges = async (childId: number) => {
    try {
      const comment = comments[childId];
      if (!comment) {
        console.error("No comment to save!");
        return;
      }

      const updatedData = toSnakeCase({ comment });

      await backend.put(`/children/${childId}`, updatedData);

      console.log(`Updated comment for child ${childId}:`, comment);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  if (!items || items.length === 0) {
    return (
      <Flex
        align="center"
        justify="center"
        minH="300px"
        p={6}
      >
        <Heading size="md">No Children Registered</Heading>
      </Flex>
    );
  }

  return (
    <Stack
      flexDirection="row"
      spacing="5vh"
      p={6}
    >
      {items.map((item) => (
        <Card
          key={item.id}
          overflow="hidden"
          boxShadow="md"
          w="320px"
        >
          <CardHeader>
            <HStack spacing={4}>
              <Image
                boxSize="60px"
                objectFit="cover"
                borderRadius="full"
                src={image}
                alt={`${item.firstName} ${item.lastName}`}
              />
              <VStack
                align="flex-start"
                spacing={0}
              >
                <Text
                  fontSize="md"
                  fontWeight="bold"
                >
                  {item.firstName} {item.lastName}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                >
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
                <Text
                  as="span"
                  fontWeight="semibold"
                >
                  Custody:
                </Text>{" "}
                <Text
                  as="span"
                  color="gray.700"
                >
                  {item.custody ?? "N/A"}
                </Text>
              </Box>
              <Box>
                <Text
                  as="span"
                  fontWeight="semibold"
                >
                  School:
                </Text>{" "}
                <Text
                  as="span"
                  color="gray.700"
                >
                  {item.school ?? "N/A"}
                </Text>
              </Box>
            </Stack>
          </CardBody>
          <CardFooter>
            <Stack
              w="100%"
              spacing={2}
            >
              <Text>Comments</Text>
              <HStack
                w="100%"
                align="start"
              >
                <Textarea
                  flex="1"
                  height="100px"
                  placeholder="Enter comment"
                  value={comments[item.id] || item.comments || ""}
                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                />
              </HStack>
              {/* <Button
                    colorScheme="blue"
                    onClick={() => handleSaveChanges(item.id)}
                    size="sm"
                    w="20%"
                  >
                    Save
                  </Button> */}
            </Stack>
          </CardFooter>
        </Card>
      ))}
    </Stack>
  );
}

export default ChildrenCards;
