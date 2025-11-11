import { Box, Circle, Heading, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

type Props = {
  onExit: () => Promise<void>;
};

export const RandomSurveyConfirmation = ({ onExit }: Props) => {
    const { logout } = useAuthContext();
    useEffect(() => {
        const handleClick = async () => {
            try {
                await logout();
            } catch (error) {
                console.error(error);
            }
            finally {
                onExit();
            }
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [onExit, logout]);

    return (
        <Box
            width={"100%"}
            height={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"20px"}
        >
            <Heading
                color={"#000"}
                textAlign={"center"}
                fontSize={"40.436px"}
                fontWeight={"400"}
                lineHeight={"normal"}
            >
                You're all set!
            </Heading>
            <Box
                color={"#43A047"}
                fontSize={"229px"}
            >
                <MdCheckCircle />
            </Box>
            <Text
                color={"rgba(0, 0, 0, 0.36)"}
                textAlign={"center"}
                fontSize={"20.218px"}
                fontWeight={"400"}
                lineHeight={"normal"}
            >
                Please return device to front desk.
            </Text>
        </Box>
    )
}