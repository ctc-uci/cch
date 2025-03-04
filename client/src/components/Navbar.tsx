import {
  Avatar,
  Box,
  Flex,
  HStack,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { NavLink } from "react-router-dom";

import { User } from "../types/user";

interface NavbarProps {
  user: User;
}

export const Navbar = ({user}: NavbarProps) => {
  const role = user.role;
  const makeNavTabs = (pageName: string, path: string) => {
    return (
      <Link
        as={NavLink}
        to={path}
      >
        <Text>{pageName}</Text>
      </Link>
    );
  };

  const createTabs = (role: User["role"]) => {
    if (role === "admin") {
      return (
        <>
          {makeNavTabs("Client Statistics", "/admin-client-list")}
          {makeNavTabs("Client Forms", "/forms-hub")}
          {makeNavTabs("Monthly Statistics", "/monthly-statistics")}
          {makeNavTabs("Donations", "/donations")}
          {makeNavTabs("Volunteer Tracking", "/volunteers")}
          {makeNavTabs("Settings", "/settings")}
        </>
      );
    } else if (role === "user") {
      return (
        <>
          {makeNavTabs("Client List", "/clientlist")}
          {makeNavTabs("Forms", "/forms-hub")}
          {makeNavTabs("Donations", "/donations")}
          {makeNavTabs("Settings", "/settings")}
        </>
      );
    }
  };

  return (
    <Flex>
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
        <Flex>
          <HStack>
            <Avatar src={"/vite.svg"} />
            <Box>Colette's Children's Home</Box>
            <HStack spacing={5}>{createTabs(role)}</HStack>
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};
