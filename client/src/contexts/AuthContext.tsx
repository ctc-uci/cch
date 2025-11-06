import { createContext, ReactNode, useEffect, useState } from "react";

import { CreateToastFnReturn, Spinner } from "@chakra-ui/react";

import { AxiosInstance } from "axios";
import {
  createUserWithEmailAndPassword,
  EmailAuthCredential,
  EmailAuthProvider,
  getRedirectResult,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { useNavigate, Navigate, NavigateFunction } from "react-router-dom";

import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";
import { cookieKeys, setCookie, clearAllAuthCookies } from "../utils/auth/cookie";

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
  createCode: (email: string, authCredential: EmailAuthCredential) => Promise<void>;
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
  const navigate = useNavigate();

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

    // await backend.delete(`users/email/${email}`);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    try {
      await backend.put("/users/updateUser", {
        email: email,
        firstName: firstName,
        lastName: lastName,
          phoneNumber: phoneNumber,
          firebaseUid: userCredential.user.uid,
        });
      } catch (error) {
        console.error("Error updating user:", error);
      }

    // await backend.post("/users/create", {
    //   email: email,
    //   firebaseUid: userCredential.user.uid,
    //   firstName: firstName,
    //   lastName: lastName,
    //   phoneNumber: phoneNumber,
    //   role,
    // });

    // Set access token in cookie for persistent login
    const idToken = await userCredential.user.getIdToken();
    setCookie({
      key: cookieKeys.ACCESS_TOKEN,
      value: idToken,
    });

    return userCredential;
  };

  const login = async ({ email, password }: EmailPassword) => {
    if (currentUser) {
      // TODO CHANGE TO REDIRECT IF LOGGED IN
      signOut(auth);
    }

    const user = await backend.get(`/users/email/${email}`)

    if(user.data.length === 0){
      throw new Error("Incorrect username or password");
    }
    
    const authCredential = EmailAuthProvider.credential(email, password);
    setAuthCredential(authCredential);
    setEmail(email);

    return authCredential;
  };

  const createCode = async (email: string, authCredential: EmailAuthCredential) => {
    try {
      
      // Delete all the stale codes associated with this email
      // await backend.delete(`authentification/email?email=${email}`);

      // Create new code for them
      const now = new Date();
      const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
      const authData = await backend.post(`/authentification`, {
        email: email,
        validUntil: validUntil,
      });


      //const code = authData?.data[0]?.code;
      // Send the code to the user via email
    } catch (error) {
      console.error("Error creating code:", error);
    }
  };

  const authenticate = async ({ code }: Authenticate) => {
    if (authCredential && email) {
      const response = await backend.post(
        `/authentification/verify?email=${encodeURIComponent(email)}&code=${code}`
      );
      if (response.data.length === 0) {
        throw new Error("Invalid code. Try again.");
      }

      const userCredential = await signInWithCredential(auth, authCredential);
      // we have to update the currnet user role BEFORE we sign in or else the app won't know what role we are currently
      const userData = await backend.get(`/users/${userCredential.user.uid}`);
      setCurrentUserRole(userData.data[0]?.role);

      // Set access token in cookie for persistent login
      const idToken = await userCredential.user.getIdToken();
      setCookie({
        key: cookieKeys.ACCESS_TOKEN,
        value: idToken,
      });

      setAuthCredential(null);
      setEmail(null);
      return userCredential;
    } 
  };

  const logout = async () => {
    // Clear all authentication cookies
    clearAllAuthCookies();
    <Navigate to={"/landing-page"} />;
    return signOut(auth);
  };

  const resetPassword = async ({ email }: Pick<EmailPassword, "email">) => {
    try {
      await backend.post("/authentification/reset-password", { email });
    } catch (error: any) {
      // Re-throw with Firebase-style error codes for compatibility
      if (error.response?.status === 400 && error.response?.data?.error?.includes("No user found")) {
        const firebaseError = new Error("auth/user-not-found");
        (firebaseError as any).code = "auth/user-not-found";
        throw firebaseError;
      }
      throw error;
    }
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
        
        // Set access token in cookie for persistent login
        const idToken = await result.user.getIdToken();
        setCookie({
          key: cookieKeys.ACCESS_TOKEN,
          value: idToken,
        });
        
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

    const setAuthCookie = async (user: User | null) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setCookie({
            key: cookieKeys.ACCESS_TOKEN,
            value: idToken,
          });
        } catch (error) {
          console.error("Error setting auth cookie:", error);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchRole(user);
        await setAuthCookie(user);
      }

      setLoading(false);
      setInitialized(true);
    });

    return unsubscribe;
  }, [backend]);

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
