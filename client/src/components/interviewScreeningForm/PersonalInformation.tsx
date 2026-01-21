import { Box, Button, Flex, IconButton, Text, useToast, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { InterviewScreeningFormProps } from './types';
import { ChevronLeftIcon } from '@chakra-ui/icons/ChevronLeft';
import { InterviewScreeningForm } from './InterviewScreeningForm';
import { useState } from 'react';
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
import { useAuthContext } from '../../contexts/hooks/useAuthContext';
import { useForm } from '../../contexts/formContext';
import { SuccessScreen } from '../SuccessScreen';

const PersonalInformation: React.FC<InterviewScreeningFormProps> = ({ hidden: _hidden }: InterviewScreeningFormProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const { formData } = useForm();
  const toast = useToast();
  const [onReview, setOnReview] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  type Language = 'english' | 'spanish';
  const language = ((params.language as string) === 'spanish' ? 'spanish' : 'english') as Language;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onReview) {
      try {
        if (!currentUser?.email) {
          toast({
            title: "Authentication Error",
            description: "An error has occurred. Please re-login to continue.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        const response = await backend.get(`/clients/email/${encodeURIComponent(currentUser.email)}`);
        const clientData = response.data?.[0];
        if (!clientData) {
          toast({
            title: "Error",
            description: "Client data not found. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        const payload = {
          ...formData,
          name: formData.firstName + " " + formData.lastName,
          client_id: clientData.id,
        };
        const submitResponse = await backend.post("/initialInterview", payload);
        if (submitResponse.status === 200) {
          toast({
            title: "Form submitted",
            description: "Thank you for completing the interview screening form!",
            status: "success",
          });
          setSubmitted(true);
        }
      } catch (err: unknown) {
        const error = err as Error & { message?: string };
        console.log("error", error?.message);
        toast({
          title: "Error",
          description: error?.message || "An error occurred while submitting the form.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      setOnReview(true);
    }
  };

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <Box
      bg={onReview ? "#E7F0F4" : "transparent"}
      p={4}
      minH="100vh"
    >
      <Box width={'70%'} margin={'auto'} marginTop={16} padding={4} borderRadius={8} boxShadow="0 0 10px 1px grey" backgroundColor="white">
      <IconButton
            aria-label="Back to personal"
            icon={<ChevronLeftIcon boxSize={8} />}
            onClick={onReview ? () => setOnReview(false) : () => navigate('/admin-client-forms')}
            colorScheme="blue"
            variant="ghost"
            size="lg"
        />
        {onReview && (
          <Text
            fontSize="4xl"
            color="blue.400"
            pl={4}
            mx="auto"
            fontWeight="normal"
            mb={4}
          >
            Review
          </Text>
        )}
        <VStack spacing={4} align="stretch">
          <Box
            maxH={onReview ? "100vh" : "auto"}
            overflowY={onReview ? "auto" : "visible"}
            bg={onReview ? "white" : "transparent"}
            borderRadius={onReview ? "xl" : "none"}
            boxShadow={onReview ? "sm" : "none"}
            p={onReview ? 8 : 0}
            mx={onReview ? "auto" : 0}
            width={onReview ? "100%" : "auto"}
          >
            <form onSubmit={handleSubmit}>
              <InterviewScreeningForm
                onReview={onReview}
                setOnReview={setOnReview}
                spanish={language === 'spanish'}
              />
              {!onReview && (
                <Flex justify="flex-end" mt={6}>
                  <Button size="lg" colorScheme="blue" type="submit">
                    {language === "spanish" ? "Revisar" : "Review"}
                  </Button>
                </Flex>
              )}
            </form>
          </Box>

          {onReview && (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Button
                onClick={() => setOnReview(false)}
                bg="#C4C4C4"
                size="lg"
              >
                Cancel
              </Button>

              <Button
                size="lg"
                colorScheme="blue"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                Submit
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default PersonalInformation;
