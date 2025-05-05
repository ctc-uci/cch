import { Navigate } from "react-router-dom";

import { useAuthContext } from "../contexts/hooks/useAuthContext";
import { useRoleContext } from "../contexts/hooks/useRoleContext";

import { Spinner } from "@chakra-ui/react";
interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles?: string | string[];
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const ProtectedRoute = ({
  element,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { currentUser, loading, initialized } = useAuthContext();
  const { role } = useRoleContext();


  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const isValidRole = getIsValidRole(roles, role);
  
  if (currentUser && isValidRole) {
    console.log(role)
    console.log('validated to ' + element)
  } else {
    console.log(role)
    console.log(currentUser)
    console.log('blocked to ' + element)
  }
  if (!initialized && (loading || role === undefined)) { 
    return <Spinner/>;
  }

  return currentUser && isValidRole ? (
    element
  ) : currentUser && role === "admin" ? (
    <Navigate to={"/admin-client-list"} />
  ) : currentUser && role === "user" ? (
    <Navigate to={"/clientlist"} />
  ) : (
    <Navigate to={"/"} />
  );
};

/**
 * Helper function for determining if a user may access a route based on their role.
 * If no allowed roles are specified, or if the user is an admin, they are authorized. Otherwise, their role must be within the list of allowed roles.
 *
 * @param roles a list of roles which may access this route
 * @param role the current user's role
 */
function getIsValidRole(roles: string[], role: string | undefined) {
  return (
    roles.length === 0 ||
    (role !== undefined && roles.includes(role)) ||
    role === "admin"
  );
}
