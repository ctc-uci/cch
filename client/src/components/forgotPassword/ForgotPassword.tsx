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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import cch from "../../../public/cch_logo.png";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userType } = useParams<{ userType: string }>();
  const userAbbreviation = userType === "Case Manager" ? "CM" : "AD";

  const { resetPassword, handleRedirectResult } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const toastResetPasswordError = useCallback(
    (msg: string) => {
      toast({
        title: "An error occurred while resetting password",
        description: msg,
        status: "error",
        variant: "subtle",
      });
    },
    [toast]
  );

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword(data.email);

      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a link to reset your password.",
        status: "success",
        variant: "subtle",
      });

      navigate("/login");
    } catch (err) {
      const errorCode = err.code;
      const firebaseErrorMsg = err.message;

      switch (errorCode) {
        case "auth/user-not-found":
          toastResetPasswordError("No user found with that email address.");
          break;
        case "auth/too-many-requests":
          toastResetPasswordError("Too many attempts. Please try again later.");
          break;
        default:
          toastResetPasswordError(firebaseErrorMsg);
      }
    }
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  return (
    <Grid templateColumns="1fr 2fr" height="100vh">
     
      <Box display="flex" alignItems="center" justifyContent="center" bg="#E2E8F0">
        <VStack spacing="20px">
          <Circle size="250px" bg="#63B3ED" color="black" fontSize="210%">
            {userAbbreviation}
          </Circle>
          <Text fontSize="3xl" fontWeight="bold">
            {userType}
          </Text>
        </VStack>
      </Box>

  
      <Center>
        <VStack spacing={0} sx={{ width: 400 }}>
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
              onClick={() => {
                navigate(-1);
              }}
              variant="ghost"
              boxSize={"50px"}
              size={"lg"}
            />
            <Image src={cch} alt="logo" height="50px" />
          </HStack>

          <Heading mb={2} mr="auto">Forgot Password</Heading>
          <Text fontWeight="light" mb={5} mr="auto">Enter your email to reset your password</Text>

          <form onSubmit={handleSubmit(handleResetPassword)} style={{ width: "100%" }}>
            <Stack>
              
              <FormControl isInvalid={!!errors.email} w={"100%"}>
                <Input
                  placeholder="Email"
                  type="email"
                  size={"lg"}
                  {...register("email")}
                  name="email"
                  isRequired
                  autoComplete="email"
                  mb={4}
                />
                <FormErrorMessage>{errors.email?.message?.toString()}</FormErrorMessage>
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
                Send Email
              </Button>

              <Text fontSize="sm" fontWeight="light" mx={"auto"}>
                Remembered your password?{" "}
                <ChakraLink as={Link} to={`/login/${userType}`} color="blue.500" display="inline">
                  <Text as="u" display="inline">Login</Text>
                </ChakraLink>
              </Text>
            </Stack>
          </form>
        </VStack>
      </Center>
    </Grid>
  );
};
