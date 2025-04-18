import { createContext, ReactNode, useEffect, useState } from "react";

import { CreateToastFnReturn, Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { AxiosInstance } from "axios";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";

import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

interface AuthContextProps {
  currentUser: User | null;
  currentUserRole: string | null;
  loading: boolean;
  initialized: boolean;
  signup: ({ email, password, firstName, lastName, phoneNumber, role }: SignupInfo) => Promise<UserCredential>;
  login: ({ email, password }: EmailPassword) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: ({ email }: Pick<EmailPassword, "email">) => Promise<void>;
  handleRedirectResult: (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface EmailPassword {
  email: string;
  password: string;
}

interface SignupInfo {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const signup = async ({ email, password, firstName, lastName, phoneNumber, role }: SignupInfo) => {
    if (currentUser) {
      signOut(auth);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await backend.post("/users/create", {
      email: email,
      firebaseUid: userCredential.user.uid,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      role,
    });

    return userCredential;
  };

  const login = ({ email, password }: EmailPassword) => {
    if (currentUser) {
      signOut(auth);
    }

    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    <Navigate to={"/landing-page"} />
    return signOut(auth);
    
  };

  const resetPassword = ({ email }: Pick<EmailPassword, "email">) => {
    return sendPasswordResetEmail(auth, email);
  };

  /**
   * Helper function which keeps our DB and our Firebase in sync.
   * If a user exists in Firebase, but does not exist in our DB, we create a new user.
   *
   * **If creating a DB user fails, we rollback by deleting the Firebase user.**
   */
  const handleRedirectResult = async (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn
  ) => {
    try {
      const result = await getRedirectResult(auth);

      if (result) {
        const response = await backend.get(`/users/${result.user.uid}`);
        if (response.data.length === 0) {
          try {
            await backend.post("/users/create", {
              email: result.user.email,
              firebaseUid: result.user.uid,
            });
          } catch (e) {
            await backend.delete(`/users/${result.user.uid}`);
            toast({
              title: "An error occurred",
              description: `Account was not created: ${e.message}`,
              status: "error",
            });
          }
        }
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Redirect result error:", error);
    }
  };

  useEffect(() => {
    const fetchRole = async (user: User) => {
      const data = await backend.get(`/users/${user.uid}`);
      setCurrentUserRole(data.data.role);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if(user){
        fetchRole(user);
      }

      setLoading(false);
      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserRole,
        signup,
        login,
        logout,
        resetPassword,
        handleRedirectResult,
      }}
    >
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
