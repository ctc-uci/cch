import { createContext, ReactNode, useEffect, useState } from "react";

import { CreateToastFnReturn, Spinner } from "@chakra-ui/react";

import { AxiosInstance } from "axios";
import {
  createUserWithEmailAndPassword,
  EmailAuthCredential,
  EmailAuthProvider,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { Navigate, NavigateFunction } from "react-router-dom";

import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

interface AuthContextProps {
  currentUser: User | null;
  currentUserRole: string | null;
  loading: boolean;
  initialized: boolean;
  signup: ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
  }: SignupInfo) => Promise<UserCredential>;
  login: ({ email, password }: EmailPassword) => Promise<EmailAuthCredential>;
  createCode: () => Promise<void>;
  logout: () => Promise<void>;
  authenticate: ({ code }: Authenticate) => Promise<UserCredential | void>;
  resetPassword: ({ email }: Pick<EmailPassword, "email">) => Promise<void>;
  handleRedirectResult: (
    backend: AxiosInstance,
    navigate: NavigateFunction,
    toast: CreateToastFnReturn
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface Authenticate {
  code: number;
}

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
  const [authCredential, setAuthCredential] =
    useState<EmailAuthCredential | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const signup = async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
  }: SignupInfo) => {
    if (currentUser) {
      signOut(auth);
    }
    const existingUser = await backend.get(`/users/email/${email}`);

    if (existingUser.data.length === 0) {
      throw new Error(
        `Unauthorized email to create ${role === "user" ? "Case Manager" : "Admin"} account`
      );
    }

    if (existingUser.data[0].firebaseUid) {
      throw new Error("Email already in use");
    }

    if (existingUser.data[0].role !== role) {
      throw new Error("Not authorized to create this type of user");
    }

    await backend.delete(`users/email/${email}`);

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

  const login = async ({ email, password }: EmailPassword) => {
    if (currentUser) {
      signOut(auth);
    }
    const authCredential = EmailAuthProvider.credential(email, password);
    setAuthCredential(authCredential);
    setEmail(email);

    return authCredential;
  };

  const createCode = async () => {
    if (authCredential && email) {
      try {
        // Delete all the stale codes associated with this email
        await backend.delete(`authentification/email?email=${email}`);

        // Create new code for them
        const now = new Date();
        const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const authData = await backend.post("/authentification", {
          email: email,
          validUntil: validUntil,
        });
        const code = authData?.data[0]?.code;

        // Send the code to the user via email

        await backend.post("/authentification/email", {
          email: email,
          message: `
          Hi,

          Your two-factor authentication (2FA) code is:

          ${code}

          This code will expire in 24 hours. If you did not request this code, please ignore this email or contact our support team immediately.

          Stay secure,

          Collete's Children's Home
          `,
        });

        return;
      } catch (error) {
        console.error("Error signing in with credential:", error);
      }
    }
  };

  const authenticate = async ({ code }: Authenticate) => {
    if (authCredential && email) {
      const response = await backend.post(
        `/authentification/verify?email=${email}&code=${code}`
      );
      if (response.data.length == 0) {
        throw new Error("Invalid code. Try again.");
      }

      const userCredential = await signInWithCredential(auth, authCredential);

      // we have to update the currnet user role BEFORE we sign in or else the app won't know what role we are currently
      const userData = await backend.get(`/users/${userCredential.user.uid}`);
      setCurrentUserRole(userData.data[0]?.role);

      setAuthCredential(null);
      setEmail(null);
      return userCredential;
    } 
  };

  const logout = () => {
    <Navigate to={"/landing-page"} />;
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
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
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
        loading,
        initialized,
        signup,
        login,
        createCode,
        logout,
        authenticate,
        resetPassword,
        handleRedirectResult,
      }}
    >
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
