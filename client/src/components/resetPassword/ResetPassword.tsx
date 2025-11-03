import { useState, useEffect } from "react";
import {
  Button,
  Center,
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
  IconButton,
} from "@chakra-ui/react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import cch from "../../../public/cch_logo.png";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { backend } = useBackendContext();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  // Verify code when component loads
  useEffect(() => {
    const verifyCode = async () => {
      if (!email || !code) {
        toast({
          title: "Error",
          description: "Invalid reset link. Please use the link from your email.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/forgot-password");
        return;
      }

      setIsVerifying(true);
      try {
        await backend.post("/authentification/verify-reset-code", {
          email,
          code,
        });
        setIsCodeValid(true);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || "Invalid or expired reset code";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/forgot-password");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [email, code, backend, navigate, toast]);

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    if (!email || !code) {
      toast({
        title: "Error",
        description: "Invalid reset link. Please use the link from your email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/forgot-password");
      return;
    }

    setIsSubmitting(true);
    try {
      // Reset password (code verification already done on page load)
      await backend.post("/authentification/confirm-reset-password", {
        email,
        code,
        newPassword: data.newPassword,
      });

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now login with your new password.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "An error occurred while resetting your password";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid templateColumns="1fr 2fr" height="100vh">
      <Box display="flex" alignItems="center" justifyContent="center" bg="#E2E8F0">
        <VStack spacing="20px">
          <Circle size="250px" bg="#63B3ED" color="black" fontSize="210%">
            CCH
          </Circle>
          <Text fontSize="3xl" fontWeight="bold">
            Reset Password
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
                navigate("/forgot-password");
              }}
              variant="ghost"
              boxSize={"50px"}
              size={"lg"}
            />
            <Image src={cch} alt="logo" height="50px" />
          </HStack>

          <Heading mb={2} mr="auto">Reset Your Password</Heading>
          <Text fontWeight="light" mb={5} mr="auto">
            {email ? `Enter your new password for ${email}` : "Enter your new password"}
          </Text>

          {isVerifying ? (
            <Text>Verifying reset link...</Text>
          ) : isCodeValid ? (
            <form onSubmit={handleSubmit(handleResetPassword)} style={{ width: "100%" }}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.newPassword}>
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  New Password
                </Text>
                <Input
                  placeholder="Enter new password"
                  type="password"
                  size="lg"
                  {...register("newPassword")}
                  autoComplete="new-password"
                />
                <FormErrorMessage>{errors.newPassword?.message?.toString()}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  Confirm Password
                </Text>
                <Input
                  placeholder="Confirm new password"
                  type="password"
                  size="lg"
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                />
                <FormErrorMessage>{errors.confirmPassword?.message?.toString()}</FormErrorMessage>
              </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  bg={"#4299E1"}
                  color={"white"}
                  sx={{ width: "65%" }}
                  mx={"auto"}
                  mb={4}
                  isLoading={isSubmitting}
                  isDisabled={Object.keys(errors).length > 0}
                >
                  Reset Password
                </Button>

                <Text fontSize="sm" fontWeight="light" mx={"auto"} textAlign="center">
                  Remember your password?{" "}
                  <Link to="/login" style={{ color: "#4299E1", textDecoration: "underline" }}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </form>
          ) : null}
        </VStack>
      </Center>
    </Grid>
  );
};

