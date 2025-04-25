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
  IconButton,
  PinInput,
  PinInputField
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

export const Authentification = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userType } = useParams<{ userType: string }>();
  const userAbbreviation = userType === "Case Manager" ? "CM" : "AD";

  const { resetPassword, handleRedirectResult, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
    // update when 2FA is integrated
  const handlePinSubmit = () => {
    navigate("/admin-client-list")
  }

  useEffect(() => {
    const generateCode = async () => {
      try {
        const validUntil = new Date().getTime() + 24 * 60 * 60 * 1000;

        const res = await backend.post('/authentification', {
          email: currentUser?.email, validUntil: validUntil
        });

        console.log(res.data);
      } catch (err) {
        console.error('Error posting code: ', err);
      }
    }
    generateCode();
    // console.log("current user", currentUser);
  }, [backend]);

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
        <VStack spacing={0} sx={{ width: 500 }}>
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

          <Heading mb={2}>Enter Admin Pin</Heading>
          

           <form onSubmit={handlePinSubmit} style={{ width: "100%" }}>
            <Stack align="center" justify="center"> 
              
              <FormControl w={"100%"} >
                <HStack justify="center" m={3}>
                <PinInput size="lg">
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                </PinInput>
                </HStack>
               
              </FormControl>
              <Text fontWeight="light" fontSize="sm" textAlign="center" mb={5}>Admin pins are sent to admins for confirmation. After pin is entered, a request is sent to that admin to verify your account. </Text>
 
              <Button
                type="submit"
                size={"lg"}
                bg={"#4299E1"}
                color={"white"}
                sx={{ width: "65%" }}
                mx={"auto"}
                mb={4}
              >
                Send Request
              </Button>
            </Stack>
          </form>
        </VStack>
      </Center>
    </Grid>
  );
};
