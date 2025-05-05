import { Box, Flex, Text, Circle, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const ChooseLogin = () => {
    const navigate = useNavigate();

    const handleUserSelection = (userType: string) => {
        navigate(`/login/${userType}`);
    };

    return (
        <Box bg="white" minH="100vh" display="flex" justifyContent="center" alignItems="center">
            <VStack gap={10}>
                <Heading textAlign="center" mb={6}>
                    Who's logging in?
                </Heading>

                <Flex justify="center" gap={100}>
                    <Flex direction="column" align="center" cursor="pointer" onClick={() => handleUserSelection("Admin")}>
                        <Circle size="250px" bg="#63B3ED" color="black" fontSize="210%">
                            AD
                        </Circle>
                        <Text mt={5} fontSize="200%" fontWeight="medium">
                            Admin
                        </Text>
                    </Flex>

                    <Flex direction="column" align="center" cursor="pointer" onClick={() => handleUserSelection("Case Manager")}>
                        <Circle size="250px" bg="#63B3ED" color="black" fontSize="210%">
                            CM
                        </Circle>
                        <Text mt={5} fontSize="200%" fontWeight="medium">
                            Case Manager
                        </Text>
                    </Flex>

                    <Flex direction="column" align="center" cursor="pointer" onClick={() => handleUserSelection("Client")}>
                        <Circle size="250px" bg="#63B3ED" color="black" fontSize="210%">
                            CL
                        </Circle>
                        <Text mt={5} fontSize="200%" fontWeight="medium">
                            Client
                        </Text>
                    </Flex>
                </Flex>
            </VStack>
        </Box>
    );
};
