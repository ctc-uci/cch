import { useEffect } from "react";

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
  IconButton,
  Image
} from "@chakra-ui/react";

import cch from "../../../public/cch_logo.png";

import { MdOutlineArrowBackIos } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
})
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "Passwords don't match",
        code: z.ZodIssueCode.custom,
      });
    }
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = () => {
  const { userType = "Admin"} = useParams<{ userType: string }>();
  const userAbbreviation = userType === "Case Manager" ? "CM" : "AD";
  const navigate = useNavigate();
  const toast = useToast();
  const { signup, handleRedirectResult } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const handleSignup = async (data: SignupFormValues) => {
    console.log("submitted");
    try {
      console.log({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: userType === "Admin" ? "admin" : (userType === "Case Manager" ? "user" : "client"),
      });
      const user = await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: userType === "Admin" ? "admin" : (userType === "Case Manager" ? "user" : "client"),
      });
      console.log(user);
      if (user) {
        navigate(`/admin-pin/${userType}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "An error occurred",
          description: err.message,
          status: "error",
          variant: "subtle",
        });
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
        <VStack spacing={8} sx={{ width: 300 }}>
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
              onClick={() => {navigate(-1)}}
              variant="ghost"
              boxSize={"50px"}
              size={"lg"}
            />
            <Image src={cch} alt="logo"  height="50px" />
          </HStack>
          <Heading>Create Account</Heading>

          <form onSubmit={handleSubmit(handleSignup)} style={{ width: "100%" }}>
            <Stack spacing={2}>

            <Text>Email</Text>
              <FormControl isInvalid={!!errors.email}>
                <Center>
                  <Input
                    placeholder="Email"
                    type="email"
                    size={"lg"}
                    {...register("email")}
                    name="email"
                    isRequired
                    autoComplete="email"
                  />
                </Center>
                <FormErrorMessage>
                  {errors.email?.message?.toString()}
                </FormErrorMessage>
              </FormControl>

              <Text>Password</Text>
              <FormControl isInvalid={!!errors.password}>
                <Center>
                  <Input
                    placeholder="Password"
                    type="password"
                    size={"lg"}
                    {...register("password")}
                    name="password"
                    isRequired
                    autoComplete="password"
                  />
                </Center>
                <FormErrorMessage>
                  {errors.password?.message?.toString()}
                </FormErrorMessage>
              </FormControl>

              <Text>Confirm Password</Text>
              <FormControl isInvalid={!!errors.password}>
                <Center>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    size={"lg"}
                    {...register("confirmPassword")}
                    name="confirmPassword"
                    isRequired
                    autoComplete="confirmPassword"
                  />
                </Center>
                <FormErrorMessage>
                  {errors.password?.message?.toString()}
                </FormErrorMessage>
              </FormControl>

              <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
                <FormControl isInvalid={!!errors.firstName}>
                  <Text>First Name</Text>
                  <Input
                    placeholder="First Name"
                    size="lg"
                    {...register("firstName")}
                    name="firstName"
                    isRequired
                  />
                  <FormErrorMessage>{errors.firstName?.message?.toString()}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.lastName}>
                  <Text>Last Name</Text>
                  <Input
                    placeholder="Last Name"
                    size="lg"
                    {...register("lastName")}
                    name="lastName"
                    isRequired
                  />
                  <FormErrorMessage>{errors.lastName?.message?.toString()}</FormErrorMessage>
                </FormControl>
              </Grid>

              <Text>Phone Number</Text>
              <FormControl isInvalid={!!errors.phoneNumber}>
                <Center>
                  <Input
                    placeholder="Phone Number"
                    type="phoneNumber"
                    size={"lg"}
                    {...register("phoneNumber")}
                    name="phoneNumber"
                    isRequired
                    autoComplete="phoneNumber"
                  />
                </Center>
                <FormErrorMessage>
                  {errors.phoneNumber?.message?.toString()}
                </FormErrorMessage>
              </FormControl>


              <Button bg="#3182CE" mt={5} color="white" type="submit" size={"lg"} sx={{ width: "100%" }}
                isDisabled={Object.keys(errors).length > 0}>

                Create Account
              </Button>
              {Object.keys(errors)}
            </Stack>
          </form>
        </VStack>
      </Center>
    </Grid>
  );
};
