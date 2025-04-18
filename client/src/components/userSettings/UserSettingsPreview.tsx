import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Circle,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";

const UserSettingsPreview = ({
  user,
  role,
  setEditing,
  editing,
  location,
}: {
  user: object;
  role: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  location: string;
}) => {
  const { currentUser } = useAuthContext();
  console.log(location);
  const hideEditProfile = () => {
    setEditing(true);
  };

  return (
    <Box
      maxW="600px"
      minW="33%"
      mx="auto"
      p={5}
      borderRadius="md"
      boxShadow="md"
      bg="#EBF8FF"
    >
      <Flex
        justify="center"
        align="center"
        height="30vh"
      >
        <Circle
          size="200px"
          bg="#63B3ED"
          color="black"
          fontSize="210%"
          margin={10}
        >
          AD
        </Circle>
      </Flex>

      {/* About Section */}
      <Heading
        size="md"
        mb={4}
      >
        About
      </Heading>
      <Stack spacing={3}>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            NAME
          </Text>
          <Text>
            {user.firstName} {user.lastName}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            ROLE
          </Text>
          <Text>{user.role}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            LOCATION
          </Text>
          <Text>{location.name}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            EMAIL
          </Text>
          <Text>{user.email}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            PHONE
          </Text>
          <Text>{user.phoneNumber}</Text>
        </Flex>
      </Stack>

      <Divider my={5} />

      {/* Account Section */}
      <Heading
        size="md"
        mb={4}
      >
        Account
      </Heading>
      <Stack spacing={3}>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            USERNAME
          </Text>
          <Text>{currentUser?.displayName}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
          >
            PASSWORD
          </Text>
          <Text>*************</Text>
        </Flex>
      </Stack>
      {!editing && role !== "user" && (
        <Stack>
          <a
            onClick={hideEditProfile}
            style={{ cursor: "pointer" }}
          >
            <Flex>
              <EditIcon />
              <Text>Edit Profile</Text>
            </Flex>
          </a>
        </Stack>
      )}
    </Box>
  );
};

export default UserSettingsPreview;
