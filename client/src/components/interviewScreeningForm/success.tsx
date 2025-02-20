import { Box, Text } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const Success = () => {

    return(
        // <Box > 
        <Box minH={"100vh"} w={"100%"} display={'flex'} justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
            <Text fontSize={'6xl'}>You're all set!</Text>
            <MdCheckCircle size={100} color="green"/>
            <Text fontSize={'3xl'}>Please return device to front desk.</Text>
        </Box>
        
        
        
    )
};

export default Success;
