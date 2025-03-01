import UserSettingsPreview from "./UserSettingsPreview";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {useAuthContext} from "../../contexts/hooks/useAuthContext";
import { ManageAccounts } from "../admin/ManageAccounts";
import {Box, Flex} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EditSettings from "./EditSettings";

const UserSettings = () => {
    const { backend } = useBackendContext();
   // const case_manager = await backend.get(`/admin/case_managers`);
   const { currentUser } = useAuthContext();
   //console.log(currentUser);
   const [user, setUser] = useState({});
   const [editing, setEditing] = useState(false);
   const uid = currentUser?.uid;
   const [refreshStatus, setRefreshStatus] = useState(true);

   useEffect (() => {
        const fetchData = async () => {
            try {
                const response = await backend.get(`/users/${uid}`);
                setUser(response.data[0]);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        if (refreshStatus){
            setRefreshStatus(false);
            fetchData();
          }        
    }, [refreshStatus]);
  

    return (
    <div>
        <h1 style={{ marginTop: "2%", marginLeft: "2%", fontSize: "24px", fontWeight: "bold" }}> Profile Settings</h1>
        <Box w="100vw" p={8} mt={10}>
            <Flex justify="space-between" w="100%" gap={8}>
                <Box flex="1"> 
                    <UserSettingsPreview user={user} setEditing={setEditing} />
                </Box>
                {!editing && 
                <Box flex="2"> 
                    <ManageAccounts />
                </Box>
                }  
                {editing &&
                <Box flex="2"> 
                    <EditSettings user={user} />
                </Box>
                }     
            </Flex>
        </Box>
    </div>
    );
}
export default UserSettings;