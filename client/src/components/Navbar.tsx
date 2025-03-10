import { Avatar, Box, HStack, Link, Text, Button } from "@chakra-ui/react";

import { NavLink } from "react-router-dom";

import { useAuthContext } from "../contexts/hooks/useAuthContext";
import { useRoleContext } from "../contexts/hooks/useRoleContext";
import { User } from "../types/user";

export const Navbar = () => {
  const { role } = useRoleContext();
  const { logout } = useAuthContext();

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
          {makeNavTabs("Client Forms", "/admin-client-forms")}
          {makeNavTabs("Monthly Statistics", "/monthly-statistics")}
          {makeNavTabs("Donations", "/donations")}
          {makeNavTabs("Volunteer Tracking", "/volunteer-tracking")}
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
    <Box>
      <HStack
        width="100%"
        justify="space-between"
        paddingRight="54px"
        paddingLeft="54px"
        paddingTop="25px"
      >
        <HStack>
          <Avatar src={"/vite.svg"} />
          <Box>Colette's Children's Home</Box>
        </HStack>
        <HStack spacing={5}>
          {createTabs(role ?? "user")}
          <Button onClick={logout}>Sign Out</Button>
        </HStack>
      </HStack>
    </Box>
  );
};
