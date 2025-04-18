import { Spinner, Box, Text} from '@chakra-ui/react'

export const LoadingWheel = () => {
    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
        >
            <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.100'
            color='blue.500'
            size='xl'
            margin = '20px'
            />
            <Text>Loading kindness...</Text>
        </Box>
        
    )
}