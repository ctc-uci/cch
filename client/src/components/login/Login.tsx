import { useCallback, useEffect } from "react";

import {
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  useToast,
  VStack,
  Grid,
  Box,
  Circle,
  Text,
  HStack,
  Image,
  IconButton
} from "@chakra-ui/react";
import { MdOutlineArrowBackIos } from "react-icons/md";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import cch from "../../../public/cch_logo.png";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});


type SigninFormValues = z.infer<typeof signinSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userType = "Admin"} = useParams<{ userType: string }>();
  const userAbbreviation = userType === "Case Manager" ? "CM" : userType === "Client" ? "CL" : "AD";

  const { login, handleRedirectResult, loading } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const toastLoginError = useCallback(
    (msg: string) => {
      toast({
        title: "An error occurred while signing in",
        description: msg,
        status: "error",
        variant: "subtle",
      });
    },
    [toast]
  );

  const handleLogin = async (data: SigninFormValues) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      if (userType === "Case Manager") navigate("/authentification/Case Manager");
      else if (userType === "Admin") {

        navigate("/authentification/Admin");
      }
      else if (userType === "Client") navigate("/client-landing-page");
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-email":
        case "auth/user-not-found":
          toastLoginError(
            "Email address or password does not match our records!"
          );
          break;
        case "auth/unverified-email":
          toastLoginError("Please verify your email address.");
          break;
        case "auth/user-disabled":
          toastLoginError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          toastLoginError("Too many attempts. Please try again later.");
          break;
        case "auth/user-signed-out":
          toastLoginError("You have been signed out. Please sign in again.");
          break;
        default:
          toastLoginError(firebaseErrorMsg);
      }
    }
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  return (
    <Grid templateColumns="1fr 2fr" height="100vh">

    <Box display="flex" alignItems="center" justifyContent="center" bg="#E2E8F0">
      <VStack spacing='20px'>
        <Circle size="250px" bg="#63B3ED" color="black" fontSize="210%">
          {userAbbreviation}
        </Circle>
        <Text fontSize='3xl' fontWeight="bold">{userType}</Text>
      </VStack>
    </Box>


    <Center>

      <VStack spacing={8} sx={{ width: 400 }}>
        <HStack
          justifyContent="space-between"
          position="absolute"
          top={0}
          right={0}
          width="66%"
          p={4}
          height="80px"
        >
          <IconButton
            icon={<MdOutlineArrowBackIos />}
            aria-label="Go Back"
            onClick={() => {navigate("/choose-login")}}
            variant="ghost"
            boxSize={"50px"}
            size={"lg"}
          />
          <Image src={cch} alt="logo"  height="50px" />
        </HStack>

        <Heading>Welcome Back!</Heading>

        <form onSubmit={handleSubmit(handleLogin)} style={{ width: "100%" }}>
          <Stack>
            <Text fontWeight="bold">Email</Text>
            <FormControl isInvalid={!!errors.email} w={"100%"}>
              <Input
                placeholder="Email"
                type="email"
                size={"lg"}
                {...register("email")}
                name="email"
                isRequired
                autoComplete="email"
                mb={2}
              />
              <FormErrorMessage>{errors.email?.message?.toString()}</FormErrorMessage>
            </FormControl>

            <Text fontWeight="bold" >Password</Text>
            <FormControl isInvalid={!!errors.password}>
              <Input
                placeholder="Password"
                type="password"
                size={"lg"}
                {...register("password")}
                name="password"
                isRequired
                autoComplete="current-password"
                mb={1}
              />
              <FormErrorMessage>{errors.password?.message?.toString()}</FormErrorMessage>
              {userType !== "Client" &&
              <ChakraLink as={Link} to={`/forgot-password/${userType}`} display="block" textAlign="center" m="2">
                <Text as="u" fontSize="sm" fontWeight="light" >Forgot password?</Text>
              </ChakraLink>
              }

            </FormControl>

            <Button
              type="submit"
              size={"lg"}
              bg={"#4299E1"}
              color={"white"}
              sx={{ width: "65%" }}
              isDisabled={Object.keys(errors).length > 0}
              mx={"auto"}
              mb={4}
            >
              Login
            </Button>
            {userType !== "Client" &&
            <Text fontSize="sm" fontWeight="light" mx={"auto"}>
              Don't have an account?{" "}
              <ChakraLink as={Link} to={`/signup/${userType}`} color="blue.500" display="inline">
                <Text as="u" display="inline">Create account</Text>
              </ChakraLink>
            </Text>
            }

          </Stack>
        </form>
      </VStack>
    </Center>
  </Grid>
  );
};
