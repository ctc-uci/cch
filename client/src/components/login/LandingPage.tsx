import { Box, Image, VStack, Text, Spinner, Center} from "@chakra-ui/react";
import cch from "../../../public/cch_logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { useEffect } from "react";

export const LandingPage = () => {
    const navigate = useNavigate();
    const { currentUser, initialized } = useAuthContext();
    const { role, loading: roleLoading } = useRoleContext();

    useEffect(() => {
        if (initialized && !roleLoading && currentUser) {
            // Redirect based on role
            if (role === "admin") {
                navigate("/admin-client-list", { replace: true });
            } else if (role === "user") {
                navigate("/clientlist", { replace: true });
            }
        }
    }, [currentUser, role, initialized, roleLoading, navigate]);

    // Show loading spinner while auth or role is being determined
    if (!initialized || roleLoading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" color="#0099D2" />
            </Center>
        );
    }

    return (
        <Box cursor="pointer" display="flex" justifyContent="center" alignItems="center" height="100vh" onClick={() => navigate("/choose-login")}>
            <VStack gap={5}>
                <Image src={cch} alt="logo" />
                <Text color={"#0099D2"}>Press anywhere to continue </Text>
            </VStack>
        </Box>
    );
};