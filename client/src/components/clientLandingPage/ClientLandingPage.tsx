import { VStack, Image, Text, Button, ButtonGroup, Box, HStack } from "@chakra-ui/react";
import { useState } from "react";
import cch from "../../../public/cch_logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

const ClientLandingPage = () => {
    const [language, setLanguage] = useState<string | null>(null);
    const navigate = useNavigate();
    const params = useParams();
    const handleContinue = () => {
      const formSelected = params.form;
      if (formSelected === 'rcs'){
      navigate(`/random-client-survey/${language}`)
      } else if (formSelected === 'isf'){
      navigate(`/personal/${language}`)
      } else if (formSelected === 'es'){
      navigate(`/exit-survey/${language}`)
      }
      else if (formSelected === 'ss'){
      navigate(`/success-story/${language}`)
      }
    }

    return (
        <VStack
            justifyContent="center"
            height={"100dvh"}>
            <Image src={cch} alt="CCH Logo" height={300}  />
            <Text fontSize="2xl" fontWeight="bold">
                Welcome!
            </Text>
            <Text fontSize="lg">
                Choose your language.
            </Text>
            <ButtonGroup size='md' isAttached variant='ghost' colorScheme="blue" marginTop={4} style={{outlineColor:"#3182CE", outlineWidth:'2px'}} >
                <Button onClick={() => setLanguage("English")} style={language === 'English' ? { color: "white", fontWeight: "bold", backgroundColor: "#3182CE",  outlineColor:"#3182CE", outlineWidth:'1px', outlineOffset:'0px' } : { outlineColor:"#3182CE", outlineWidth:'1px', outlineOffset:'0px'}}>English</Button>
                <Button onClick={() => setLanguage("Spanish")} style={language === 'Spanish' ? { color: "white", fontWeight: "bold", backgroundColor: "#3182CE",  outlineColor:"#3182CE", outlineWidth:'1px', outlineOffset:'0px' } : {outlineColor:"#3182CE", outlineWidth:'1px', outlineOffset:'0px'}}>Español</Button>
                </ButtonGroup>
            {language && (<>
                <Text fontSize="lg" marginTop={4} width={380} textAlign="center">
                This survey helps us understand your needs so we can provide the best support possible. Your answers are confidential, and we’re here to assist if you need anything.</Text>
                <Button variant={"solid"} colorScheme="blue" size="lg" marginTop={4} onClick={handleContinue}>
                    Continue
                </Button>
            </>)}

        </VStack>
)};

const ChooseForm = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const navigate = useNavigate();
    const { logout } = useAuthContext();
    
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/landing-page');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return(
        <Box position="relative" height={"100dvh"}>
            <Button
                position="absolute"
                top={4}
                right={4}
                colorScheme="red"
                variant="outline"
                onClick={handleLogout}
            >
                Logout
            </Button>
            <VStack
                justifyContent="center"
                height={"100dvh"}>
                <Text fontSize="2xl" fontWeight="bold">
                    Please Select a Form to Complete
                </Text>
            <ButtonGroup>
                <VStack
                    justifyContent="center" gap = {8}>
                        <HStack gap = {8}>
                        <Button variant={"outline"} colorScheme="blue" size="lg" marginTop={4} width={300} height={300} onClick={() => {
                            setSelected('rcs')}} style={selected === 'rcs' ? { backgroundColor: '#3182CE', color: 'white' } : {}} >
                            Random Client Survey
                        </Button>
                        <Button variant={"outline"} colorScheme="blue" size="lg" marginTop={4} width={300} height={300} onClick={() => {
                            setSelected('isf')}} style={selected === 'isf' ? { backgroundColor: '#3182CE', color: 'white' } : {}}>
                            Initial Screener Form
                        </Button>
                        </HStack>
                        <HStack gap = {8}>

                        <Button variant={"outline"} colorScheme="blue" size="lg" marginTop={4} width={300} height={300} onClick={() => {
                            setSelected('es')}} style={selected === 'es' ? { backgroundColor: '#3182CE', color: 'white' } : {}}>
                            Exit Survey
                        </Button>
                        <Button variant={"outline"} colorScheme="blue" size="lg" marginTop={4} width={300} height={300} onClick={() => {
                            setSelected('ss')}}style={selected === 'ss' ? { backgroundColor: '#3182CE', color: 'white' } : {}} >
                            Success Story
                        </Button>
                        </HStack>
                </VStack>
                </ButtonGroup>
            {selected && (<>


                <Button variant={"outline"} colorScheme="blue" size="lg" marginTop={4} onClick={() => {
                            navigate(`/client-landing-page/${selected}`)}} >
                            Continue
                        </Button>

            </>)}

            </VStack>
        </Box>
    )
}

export {ClientLandingPage, ChooseForm};
