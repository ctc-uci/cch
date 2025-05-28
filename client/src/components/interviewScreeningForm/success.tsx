import { Box, Text } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { useParams } from "react-router-dom";

const Success = () => {
    const params = useParams();
    const text = {
        'english': {
            title: "You're all set!",
            message: "Please return device to front desk.",
        },
        'spanish': {
            title: "¡Todo listo!",
            message: "Por favor, devuelva el dispositivo a la recepción.",
        },
    }
    type Language = keyof typeof text;
    const language = (params.language as Language) || "english";
    return(
        <Box margin={40} marginTop={10}>
            <Box 
                minH="calc(100vh - 80px)" 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center" 
                gap={8}
            >
                <Text fontSize="6xl" color="#3182CE">{text[language].title}</Text>
                <MdCheckCircle size={100} color="#38A169"/>
                <Text fontSize="3xl">{text[language].message}</Text>
            </Box>
        </Box>
    );
};

export default Success;
