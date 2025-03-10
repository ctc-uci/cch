import UserSettingsPreview from "./UserSettingsPreview";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {useAuthContext} from "../../contexts/hooks/useAuthContext";
import { ManageAccounts } from "../admin/ManageAccounts";
import {Box, Flex} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EditSettings from "./EditSettings";

const UserSettings = () => {
    const { backend } = useBackendContext();

   const { currentUser } = useAuthContext();

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
        <h1 style={{ marginTop: "2%", marginLeft: "2%", fontSize: "24px", fontWeight: "bold" }}>Settings</h1>
        <Box w="100vw" p={8} mt={10}>
            <Flex justify="space-between" w="100%" gap={8}>
                <Box flex="1"> 
                    <UserSettingsPreview user={user} setEditing={setEditing} editing={editing}/>
                </Box>
                {!editing && 
                <Box flex="2"> 
                    <ManageAccounts />
                </Box>
                }  
                {editing &&
                <Box flex="2"> 
                    <EditSettings user={user} setUser={setUser} setEditing={setEditing} setRefreshStatus={setRefreshStatus} />
                </Box>
                }     
            </Flex>
        </Box>
    </div>
    );
}
export default UserSettings;