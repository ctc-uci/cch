import { useEffect, useState } from "react";

import { Box, Flex } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext.ts";
import { ManageAccounts } from "../admin/ManageAccounts";
import EditSettings from "./EditSettings";
import UserSettingsPreview from "./UserSettingsPreview";
import {LocationData} from "../../types/location.ts";

const UserSettings = () => {
  const { backend } = useBackendContext();

  const { currentUser } = useAuthContext();
  const { role } = useRoleContext();

  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const uid = currentUser?.uid;
  const [refreshStatus, setRefreshStatus] = useState(true);
  const [location, setLocation] = useState<LocationData>({
      caloptima_funded: false,
      cm_id: 0,
      date: "",
      name: ""
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`/users/${uid}`);
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (refreshStatus) {
      setRefreshStatus(false);
      fetchData();
    }
  }, [refreshStatus]);

  return (
    <>
      <h1
        style={{
          marginTop: "2%",
          marginLeft: "2%",
          fontSize: "30px",
          fontWeight: "bold",
          position: "relative",
          left: "20px",
        }}
      >
        Settings
      </h1>
      <Box
        w="100vw"
        p={8}
        mt={10}
        height="848px"
      >
        <Flex
          justify="space-between"
          w="100%"
          gap={8}
          height="100%"
        >
          <Box flex="1">
            <UserSettingsPreview
              user={user}
              role={role}
              setEditing={setEditing}
              editing={editing}
              location={location}
            />
          </Box>

          {!editing && role !== "user" && (
            <Box flex="2" height="100%">
              <ManageAccounts/>
            </Box>
          )}

          {(editing || role === "user") && (
            <Box flex="2">
              <EditSettings
                user={user}
                setUser={setUser}
                setEditing={setEditing}
                editing={editing}
                setRefreshStatus={setRefreshStatus}
                location={location}
                setLocation={setLocation}
              />
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
};
export default UserSettings;
