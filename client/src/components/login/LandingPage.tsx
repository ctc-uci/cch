import { Box, Image, VStack, Text} from "@chakra-ui/react";
import cch from "../../../public/cch_logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { useEffect } from "react";

export const LandingPage = () => {
    const navigate = useNavigate();
    const { currentUser, initialized } = useAuthContext();
    const { role } = useRoleContext();

    useEffect(() => {
        if (initialized && currentUser) {
            // Redirect based on role
            if (role === "admin") {
                navigate("/admin-client-list", { replace: true });
            } else if (role === "user") {
                navigate("/clientlist", { replace: true });
            }
        }
    }, [currentUser, role, initialized, navigate]);

    // Show loading if not initialized or if user is logged in (while redirecting)
    if (!initialized || (currentUser && !role)) {
        return null; // Or show a spinner
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