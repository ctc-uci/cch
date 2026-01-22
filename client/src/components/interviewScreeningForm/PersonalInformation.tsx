import { Box, Button, Flex, IconButton, Text, useToast, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { InterviewScreeningFormProps } from './types';
import { ChevronLeftIcon } from '@chakra-ui/icons/ChevronLeft';
import { InterviewScreeningForm } from './InterviewScreeningForm';
import { useState, useEffect, useCallback } from 'react';
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
import { useForm } from '../../contexts/formContext';
import { SuccessScreen } from '../SuccessScreen';

const PersonalInformation: React.FC<InterviewScreeningFormProps> = ({ hidden: _hidden }: InterviewScreeningFormProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const { backend } = useBackendContext();
  const { formData, setFormData } = useForm();
  const toast = useToast();
  const [onReview, setOnReview] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  type Language = 'english' | 'spanish';
  const language = (params.language?.toLowerCase() === 'spanish' ? 'spanish' : 'english') as Language;

  // Helper function to reset form to initial empty state
  const resetFormData = useCallback(() => {
    setFormData({
      applicantType: "",
      firstName: "",
      lastName: "",
      name: "",
      age: "",
      date: new Date().toISOString(),
      phoneNumber: "",
      maritalStatus: "",
      dateOfBirth: "",
      email: "",
      ssnLastFour: "",
      ethnicity: "",
      veteran: "",
      disabled: "",
      currentAddress: "",
      lastPermAddress: "",
      reasonForLeavingPermAddress: "",
      whereResideLastNight: "",
      currentlyHomeless: "",
      eventLeadingToHomelessness: "",
      howLongExperiencingHomelessness: "",
      prevAppliedToCch: "",
      whenPrevAppliedToCch: "",
      prevInCch: "",
      whenPrevInCch: "",
      childName: "",
      childDOB: "",
      city: "",
      custodyOfChild: "",
      fatherName: "",
      nameSchoolChildrenAttend: "",
      cityOfSchool: "",
      howHearAboutCch: "",
      programsBeenInBefore: "",
      monthlyIncome: "",
      sourcesOfIncome: "",
      monthlyBills: "",
      estimateAmountBills: "",
      currentlyEmployed: "",
      lastEmployer: "",
      lastEmployedDate: "",
      childrenAge: "",
      educationHistory: "",
      dateOfEducation: "",
      transportation: "",
      legalResident: "",
      medical: "",
      medicalCity: "",
      medicalInsurance: "",
      medicalConditions: "",
      medications: "",
      domesticViolenceHistory: "",
      socialWorker: "",
      socialWorkerTelephone: "",
      socialWorkerOfficeLocation: "",
      lengthOfSobriety: "",
      lastDrugUse: "",
      lastAlcoholUse: "",
      timeUsingDrugsAlcohol: "",
      beenConvicted: "",
      convictedReasonAndTime: "",
      presentWarrantExist: "",
      warrantCounty: "",
      probationParoleOfficer: "",
      probationParoleOfficerTelephone: "",
      personalReferences: "",
      personalReferenceTelephone: "",
      futurePlansGoals: "",
      lastPermanentResidenceHouseholdComposition: "",
      whyNoLongerAtLastResidence: "",
      whatCouldPreventHomeless: "",
    });
  }, [setFormData]);

  // Reset form when component mounts (when navigating back to the form)
  useEffect(() => {
    resetFormData();
  }, [resetFormData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onReview) {
      try {
        // Get email from form data
        const formEmail = formData.email || (formData as unknown as Record<string, unknown>).emailAddress as string | undefined;

        // Try to get client from intakeClients first, then fall back to clients table
        // If not found, backend will create one automatically
        let clientData = null;
        if (formEmail) {
        try {
            const intakeResponse = await backend.get(`/intakeClients/email/${encodeURIComponent(formEmail)}`);
          if (intakeResponse.data && intakeResponse.data.length > 0) {
            clientData = intakeResponse.data[0];
          }
        } catch {
          // If intakeClients doesn't have the client, try the old clients table
          try {
              const response = await backend.get(`/clients/email/${encodeURIComponent(formEmail)}`);
            if (response.data && response.data.length > 0) {
              clientData = response.data[0];
            }
          } catch {
            // Client not found in either table - backend will create one
            }
          }
        }

        // Include email from form data so backend can create client if needed
        // Include client_id if found, otherwise backend will create one
        const payload = {
          ...formData,
          name: formData.firstName + " " + formData.lastName,
          // Use the email from the form data
          email: formEmail,
          ...(clientData && { client_id: clientData.id }),
        };
        const submitResponse = await backend.post("/initialInterview", payload);
        if (submitResponse.status === 200) {
          // Reset form data to initial empty state
          resetFormData();
          
          toast({
            title: language === "spanish" ? "Formulario enviado" : "Form submitted",
            description: language === "spanish" ? "¡Gracias por completar el formulario de entrevista de selección!" : "Thank you for completing the interview screening form!",
            status: "success",
          });
          setSubmitted(true);
        }
      } catch (err: unknown) {
        const error = err as Error & { message?: string };
        console.log("error", error?.message);
        toast({
          title: language === "spanish" ? "Error" : "Error",
          description: language === "spanish" 
            ? (error?.message || "Ocurrió un error al enviar el formulario.")
            : (error?.message || "An error occurred while submitting the form."),
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
            {language === "spanish" ? "Revisar" : "Review"}
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
                {language === "spanish" ? "Cancelar" : "Cancel"}
              </Button>

              <Button
                size="lg"
                colorScheme="blue"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                {language === "spanish" ? "Enviar" : "Submit"}
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default PersonalInformation;
