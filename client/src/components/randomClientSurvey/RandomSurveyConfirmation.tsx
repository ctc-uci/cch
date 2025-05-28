import { Box, Circle, Heading, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";

type Props = {
  onExit: () => void;
};

export const RandomSurveyConfirmation = ({ onExit }: Props) => {
    useEffect(() => {
        const handleClick = () => {
        onExit();
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [onExit]);

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
                fontFamily={"Inter"}
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
                fontFamily={"Inter"}
                fontSize={"20.218px"}
                fontWeight={"400"}
                lineHeight={"normal"}
            >
                Please return device to front desk.
            </Text>
        </Box>
    )
}