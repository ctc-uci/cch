import { Box, Text } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const Success = () => {
    return (
        <Box margin={40} marginTop={10}>
            <Box 
                minH="calc(100vh - 80px)" 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center" 
                gap={8}
            >
                <Text fontSize="6xl" color="#3182CE">You're all set!</Text>
                <MdCheckCircle size={100} color="#38A169"/>
                <Text fontSize="3xl">Please return device to front desk.</Text>
            </Box>
        </Box>
    );
};

export default Success;
