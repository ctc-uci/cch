import { useCallback, useEffect, useState } from "react";
import { IoMdLock, IoMdClose } from "react-icons/io";
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
  PinInput,
  PinInputField,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
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

export const Authentification = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userType } = useParams<{ userType: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userAbbreviation = userType === "Case Manager" ? "CM" : (userType === "Client" ? "CL": "AD");

  const { handleRedirectResult, createCode, authenticate } = useAuthContext();
  const { backend } = useBackendContext();
  const [pin, setPin] = useState("");

  const handlePinChange = (value: string) => {
    setPin(value);
  };
  
  const handlePinSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await authenticate({code: Number(pin)});
      if (userType === "Case Manager") {
        navigate("/clientlist");
      }
      else if (userType === "Admin") {
        navigate("/admin-client-list");
      } else if (userType === "Client") {
        navigate("/choose-form");
      }
    } catch (error) {
      // toast({
      //   title: "Authentication Failed",
      //   description: "The entered PIN is incorrect. Please try again.",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
      onOpen();
      setPin("");
    }
  };

  // const generateCode = async () => {
  //   try {
  //     await createCode();
  //   } catch (err) {
  //     console.error('Error posting code: ', err);
  //   }
  // };

  // useEffect( () => {
  //   const generateCode = async () => {
  //     try {
  //       await createCode();
  //     } catch (err) {
  //       console.error('Error posting code: ', err);
  //     }
  //   };
  //   generateCode();
  // }, [createCode]);

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

          <Heading mb={2}>Enter {userType} Pin</Heading>
          

           <form onSubmit={handlePinSubmit} style={{ width: "100%" }}>
            <Stack align="center" justify="center"> 
              
              <FormControl w={"100%"} >
                <HStack justify="center" m={3}>
                <PinInput size="lg" value={pin} onChange={handlePinChange}>
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                    <PinInputField size="lg" />
                </PinInput>
                </HStack>
               
              </FormControl>
              <Text fontWeight="light" fontSize="sm" textAlign="center" mb={5}>An email has been sent with a 2FA code. Please input it here. </Text>
 
              <Button
                type="submit"
                size={"lg"}
                bg={"#4299E1"}
                color={"white"}
                sx={{ width: "65%" }}
                mx={"auto"}
                mb={4}
              >
                Confirm Code
              </Button>
            </Stack>
          </form>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
              borderRadius={'6px'}
              boxShadow={'0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'}
              minWidth={'450px'}
              minHeight={'200px'}
            >
              <ModalHeader display={'flex'} justifyContent={'space-between'}>
                <Box display={'flex'} alignItems={'center'} gap="10px">
                  <IoMdLock size={'27px'} style={{ marginBottom: "5px" }}/>
                  <Text fontFamily={'Inter'} fontSize={'18px'} fontWeight={'700'}>Authorization Failed</Text>
                </Box>
                <IconButton 
                  icon={<IoMdClose />} 
                  aria-label="Close" 
                  fontSize={'20px'} 
                  variant={'ghost'}  
                  height='auto' 
                  minW='auto' 
                  style={{ marginBottom: '12px' }}
                  _hover={{ backgroundColor: "transparent" }}
                  onClick={onClose}
                />
              </ModalHeader>
              <ModalBody>
                <Text
                  fontFamily={'Inter'}
                  fontSize={'16px'}
                  fontStyle={'normal'}
                  fontWeight={'400'}
                  lineHeight={'24px'}
                  color={'var(--gray-700, #2D3748)'}
                >
                  Authorization failed due to incorrect code or timeout error.
                </Text>
              </ModalBody>
              <ModalFooter
                display={'flex'}
              >
                <Button width={'100%'} backgroundColor={'#3182CE'} color={'white'} onClick={() => navigate(`/login/${userType}`)}>Return to login</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Center>
    </Grid>
  );
};
