import { createContext, ReactNode, useEffect, useState } from "react";

import { Spinner } from "@chakra-ui/react";

import type { User as DbUser, User } from "../types/user";
import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

type DbUserRole = DbUser["role"];

interface RoleContextProps {
  role: DbUserRole | undefined;
  loading: boolean;
}

export const RoleContext = createContext<RoleContextProps | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [role, setRole] = useState<DbUserRole | undefined>();
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          console.log(`[RoleContext] Fetching role for user: ${user.uid}`);
          const response = await backend.get(`/users/${user.uid}`);
          console.log(`[RoleContext] User data response:`, response.data);

          const userRole = (response.data as User[]).at(0)?.role;
          
          if (!userRole) {
            console.error(`[RoleContext] No role found for user ${user.uid}. Response:`, response.data);
          } else {
            console.log(`[RoleContext] Setting role to: ${userRole}`);
          }
          
          setRole(userRole);
        } else {
          console.log(`[RoleContext] No authenticated user, clearing role`);
          setRole(undefined);
        }
      } catch (e) {
        console.error(`[RoleContext] Error setting role:`, e);
        console.error(`[RoleContext] Error message: ${e.message}`);
        console.error(`[RoleContext] Error response:`, e.response?.data);
        setRole(undefined);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [backend]);

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {loading ? <Spinner /> : children}
    </RoleContext.Provider>
  );
};
