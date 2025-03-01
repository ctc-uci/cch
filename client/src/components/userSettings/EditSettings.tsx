import { Box, Stack, Input, Flex, Text, Button } from "@chakra-ui/react";


const EditSettings = ({user}) => {
    return (
        <div style={{gap:"5 rem"}}>
            <Box p={5} borderRadius="md" boxShadow="md" bg="white" >
            <Text fontSize="sm" fontWeight="bold" >Edit Information - About</Text>
                <Stack padding={"5rem"}>
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">NAME</Text>
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">First Name</Text>
                            <Input placeholder="First Name" defaultValue={user.firstName} />
                        </Stack>
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Last Name</Text>
                            <Input placeholder="Last Name" defaultValue={user.lastName} />
                        </Stack>
                        </Flex>
                    </Stack>
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">EMAIL</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Email</Text>
                            <Input placeholder="Email" defaultValue={user.email} />
                        </Stack>
                        </Flex>
                    </Stack>
                    
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">PHONE</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Phone Number</Text>
                            <Input placeholder="Phone Number" defaultValue={user.phoneNumber} />
                        </Stack>
                        </Flex>
                    </Stack>
                   
                </Stack>
            </Box>
            <Box p={5} borderRadius="md" boxShadow="md" bg="white" >
            <Text fontSize="sm" fontWeight="bold" >Edit Information - Account</Text>
                <Stack padding={"5rem"}>
            
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">USERNAME</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Username</Text>
                            <Input placeholder="Email" defaultValue={user.email} />
                        </Stack>
                        </Flex>
                    </Stack>
                    
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">PASSWORD</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Current Password</Text>
                            <Input placeholder="Password"  />
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">New Password</Text>
                            <Input placeholder="Password"  />
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Confirm Password</Text>
                            <Input placeholder="Password"  />
                        </Stack>
                        
                        </Flex>
                    </Stack>
                   
                </Stack>
            </Box>
            <Button colorScheme="blue" style={{marginTop: "2rem"}}>Save Changes</Button>
        </div>
    );
}
export default EditSettings;