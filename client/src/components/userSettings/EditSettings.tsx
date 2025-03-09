import { useState } from "react";
import { Box, Stack, Input, Flex, Text, Button, useToast  } from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { getCurrentUser } from "../../utils/auth/firebase";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth"; 
import { get } from "react-hook-form";

const EditSettings = ({ user, setUser, setEditing, setRefreshStatus }) => {

    const auth = getAuth();
    const toast = useToast();
    const { currentUser, resetPassword } = useAuthContext();

    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { backend } = useBackendContext();


    const handlePasswordChange = async () => {
        if (!auth.currentUser) {
            console.error("No authenticated user found.");
            return;
          }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Password mismatch",
                description: "New password and confirmation do not match.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }
        try{
            const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
        
    
        } catch (error){
            toast({
                title: "Password update failed",
                description: "Failed to update password. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }

        try {
            await updatePassword(auth.currentUser, passwordData.newPassword);
            
        } catch (error) {
            console.error("Error updating password:", error);
            toast({
                title: "Password update failed",
                description: "Failed to update password. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    };

    const handleSaveChanges = async () => {
     
        if (passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword) {
            await handlePasswordChange(); 
        } 
        try {
            console.log("Sending request: ", formData);
            const response = await backend.put("/users/update", {
                ...formData, 
                firebaseUid: user.firebaseUid,
            });

            const updatedUser = await response.data; 
            setUser(updatedUser);
            setRefreshStatus(true);
            setEditing(false);
            toast({
                position: 'bottom-right',
                title: 'Successfully Saved Changes.',
                description: Date().toLocaleString(),
                status: 'success',
                duration: 9000,
                isClosable: true,
            });

        } catch (error) {
            console.error(error);
            toast({
                title: "Error updating user",
                description: "An error occurred while saving your changes.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
        }
       
    };

    return (
        <div >
            <Flex direction="column" gap="2rem">
            <Box p={5} borderRadius="md" boxShadow="md" bg="white" borderColor="gray.100" borderWidth="1px" >
            <Text fontSize="sm" fontWeight="bold" >Edit Information - About</Text>
                <Stack padding={"5rem"}>
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">NAME</Text>
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">First Name</Text>
                            <Input name="firstName" placeholder="First Name" defaultValue={user.firstName} onChange={handleChange}/>
                        </Stack>
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Last Name</Text>
                            <Input name="lastName" placeholder="Last Name" defaultValue={user.lastName} onChange={handleChange} />
                        </Stack>
                        </Flex>
                    </Stack>
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">EMAIL</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Email</Text>
                            <Input name="email" placeholder="Email" defaultValue={user.email} onChange={handleChange} />
                        </Stack>
                        </Flex>
                    </Stack>
                    
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">PHONE</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Phone Number</Text>
                            <Input name="phoneNumber" placeholder="Phone Number" defaultValue={user.phoneNumber} onChange={handleChange} />
                        </Stack>
                        </Flex>
                    </Stack>
                   
                </Stack>
            </Box>
            <Box p={5} borderRadius="md" boxShadow="md" bg="white"  borderColor="gray.100" borderWidth="1px" >
            <Text fontSize="sm" fontWeight="bold" >Edit Information - Account</Text>
                <Stack padding={"5rem"}>
            
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">USERNAME</Text>
                 
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Username</Text>
                            <Input placeholder="Email" defaultValue={user.email} isDisabled/>
                        </Stack>
                        </Flex>
                    </Stack>
                    
                    <Stack>
                        <Flex alignItems={"center"} gap={"2rem"}>
                        <Text fontSize="md" fontWeight="bold" color="gray.500">PASSWORD</Text>
                        <Stack>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Current Password</Text>
                            <Input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">New Password</Text>
                            <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Confirm Password</Text>
                            <Input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                        </Stack>
                        </Flex>
                    </Stack>
                   
                </Stack>
            </Box>
            </Flex>
            <Button colorScheme="blue" style={{marginTop: "2rem"}} onClick={handleSaveChanges}>Save Changes</Button>
            <Button colorScheme="blue" style={{marginTop: "2rem", marginLeft: "2rem"}} onClick={() => setEditing(false)}>Cancel</Button>
        </div>
    );
}
export default EditSettings;