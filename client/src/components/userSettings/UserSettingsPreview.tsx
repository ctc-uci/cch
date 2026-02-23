import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";

type UserSettingsUser = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
};

type UserSettingsLocation = {
  name: string;
};

const UserSettingsPreview = ({
  user,
  role,
  setEditing,
  editing,
  location,
}: {
  user: UserSettingsUser;
  role: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  location: UserSettingsLocation;
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
      height="800px"
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
        <Avatar
          name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || undefined}
          size="2xl"
          boxSize="200px"
          fontSize="5rem"
          margin={10}
          sx={{ "& span": { fontSize: "5rem !important" } }}
        />
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
          <Text>{currentUser?.email}</Text>
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
        <Stack mb={2}>
          <a
            onClick={hideEditProfile}
            style={{ cursor: "pointer" }}
          >
            <Flex align="center" justify={'center'} textColor={'brand.Blue 500'} gap={2} >
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
