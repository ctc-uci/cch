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

        <Box minH={"100vh"} w={"100%"} display={'flex'} justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
            <Text fontSize={'6xl'}>{text[language].title}</Text>
            <MdCheckCircle size={100} color="green"/>
            <Text fontSize={'3xl'}>{text[language].message}</Text>
        </Box>



    )
};

export default Success;
