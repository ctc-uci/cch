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
  const hideEditProfile = () => {
    setEditing(true);
  };

  return (
    <Box
      position="absolute"
      top="200px"
      left="54px"
      width="396px"
      height="756px"
      borderRadius="12px"
      pt="80px"
      pr="32px"
      pb="100px"
      pl="32px"
      gap="40px"
      backgroundColor="#EBF8FF"
    >
      <Flex
        justify="center"
        align="center"
        height="30vh"
        display="inline-flex"
        flexDirection="column"
        alignItems="center"
        padding="80px 32px 100px 32px"
        gap="40px"
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
            <Flex align="center" justify={'center'} textColor={'brand.Blue 500'} gap={2}  >
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
