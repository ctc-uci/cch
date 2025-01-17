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
import { User } from  "../types/user";

export const Navbar = (role: User["role"]) => {
  role = "admin";
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

  const createTabs = (role: User['role']) => {
    if (role === "admin") {
      return (
        <>
          {makeNavTabs("Dashboard", "/dashboard")}
          {makeNavTabs("Forms and Tables", "/forms-and-tables")}
          {makeNavTabs("Settings", "/settings")}
        </>
      );
    } else if (role == "user") {
      return (
        <>
          {makeNavTabs("Dashboard", "/dashboard")}
          {makeNavTabs("Clients", "/clients")}
          {makeNavTabs("Donations", "/donations")}
          {makeNavTabs("Accounts", "/accounts")}
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
            <HStack spacing={5}>
              {createTabs(role)}
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};
