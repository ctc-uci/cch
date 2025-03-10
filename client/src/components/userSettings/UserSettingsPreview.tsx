import { Box, Heading, Text, Stack, Divider, Flex, Circle } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import {useState} from "react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
const UserSettingsPreview = ({user, setEditing, editing }: { user: object, setEditing: React.Dispatch<React.SetStateAction<boolean>> }) => {
 
    const { currentUser } = useAuthContext();

    const hideEditProfile =()=>{

        setEditing(true);
    }

    return (
        <Box maxW="600px" minW="33%" mx="auto" p={5} borderRadius="md" boxShadow="md" bg="#EBF8FF">

        <Flex justify="center" align="center" height="30vh">
            <Circle size="200px" bg="#63B3ED" color="black" fontSize="210%" margin={10}>
                AD
            </Circle>
        </Flex>
        
        {/* About Section */}
        <Heading size="md" mb={4}>About</Heading>
        <Stack spacing={3}>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">NAME</Text>
            <Text>{user.firstName} {user.lastName}</Text>
            </Flex>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">ROLE</Text>
            <Text>{user.role}</Text>
            </Flex>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">LOCATION</Text>
            <Text>{user.location}</Text>
            </Flex>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">EMAIL</Text>
            <Text>{user.email}</Text>
            </Flex>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">PHONE</Text>
            <Text>{user.phoneNumber}</Text>
            </Flex>
        </Stack>

        <Divider my={5} />

        {/* Account Section */}
        <Heading size="md" mb={4}>Account</Heading>
        <Stack spacing={3}>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">USERNAME</Text>
            <Text>{currentUser?.displayName}</Text>
            </Flex>
            <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">PASSWORD</Text>
            <Text>*************</Text>
            </Flex>
        </Stack>
        { !editing &&
        <Stack>
            
            <a onClick={hideEditProfile} style={{cursor: "pointer"}}>
                <Flex>
                <EditIcon/>
                <Text>Edit Profile</Text>
                </Flex>
            </a>
        </Stack>
        }
        </Box>
    );
};

export default UserSettingsPreview;
