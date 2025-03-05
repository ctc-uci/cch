import {
    Box,
    Button,
    Tabs,
    Tab,
    TabList,
    Table,
    TabPanels,
    TabPanel,
    Thead,
    Tbody,
    Th,
    Td,
    Tr
} from "@chakra-ui/react";

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    site: string;
}

interface Props {
    user: UserData;
}

const UserSettingsData: React.FC<Props> = ({ user }) => {
    return (
        <Box p={5}>
            <Tabs variant="line">
                <TabList>
                <Tab>Administrators</Tab>
                <Tab>Case Managers</Tab>
                <Tab>Client Forms Portal</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box display="flex" justifyContent="flex-end" mb={4}>
                            <Button colorScheme="blue">Delete</Button>
                            <Button colorScheme="blue" mr={2}>Add</Button>
                        </Box>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                <Th>#</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Site</Th>
                                <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>{user.id}</Td>
                                    <Td>{user.firstName} {user.lastName}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>{user.site}</Td>
                                    <Td>
                                    <Button
                                        aria-label="Delete"
                                        colorScheme="blue"
                                        
                                    />
                                    </Td>
                                </Tr>
                            </Tbody>
                            </Table>
                        </TabPanel>

                </TabPanels>

            </Tabs>    
        </Box>



    )
};

export default UserSettingsData;