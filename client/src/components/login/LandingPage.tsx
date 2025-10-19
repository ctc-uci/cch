import { Box, Image, VStack, Text} from "@chakra-ui/react";
import cch from "../../../public/cch_logo.png";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box cursor="pointer" display="flex" justifyContent="center" alignItems="center" height="100vh" onClick={() => navigate("/choose-login")}>
            <VStack gap={5}>
                <Image src={cch} alt="logo" />
                <Text color={"#0099D2"}>Press anywhere to continue </Text>
            </VStack>
        </Box>
    );
};