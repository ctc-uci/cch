import { Navbar } from "../Navbar"
import {
    Button,
    Link as ChakraLink,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    VStack,
    Radio,
    RadioGroup,
    Textarea,
    useToast,
    Select,
    HStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {screenerComment} from "../../types/screenerComment";

export const ClientInterviewScreening = () => {
    const { backend } = useBackendContext();
    const [items, setItems] = useState<screenerComment[]>([]);

    
    useEffect(() => {
        const getData = async () => {
          try {
            const screeningCommentsResponse = await backend.get(
              `/screenerComment`
            );
    
            setItems(screeningCommentsResponse.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        getData();

        console.log(items)
      }, []);
    

    return (
        <>
            <VStack spacing={4}>
                <Heading>Initial Screener Comment Forms</Heading>
                <HStack>
                    <Flex>
                        <Heading>Please Select a Form</Heading>
                        <Text>Last Updated: MM/DD/YYYY HH:MM XX</Text>
                    </Flex>
                </HStack>
                <HStack>
                    <Input placeholder='Search' />
                    <Menu>
                        <MenuButton as={Button}>
                            Sort
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Initial Interview ID</MenuItem>
                            <MenuItem>Case Manager ID</MenuItem>
                            <MenuItem>Willingnes</MenuItem>
                            <MenuItem>Employability</MenuItem>
                            <MenuItem>Attitude</MenuItem>
                            <MenuItem>Length Of Sobriety</MenuItem>
                            <MenuItem>Completed TX</MenuItem>
                            <MenuItem>Drug Test Results</MenuItem>
                            <MenuItem>Homeless Episode One</MenuItem>
                            <MenuItem>Homeless Episode Two</MenuItem>
                            <MenuItem>Homeless Episode Three</MenuItem>
                            <MenuItem>Homeless Episode Four</MenuItem>
                            <MenuItem>Disabling Condition</MenuItem>
                            <MenuItem>Employed</MenuItem>
                            <MenuItem>Driver License</MenuItem>
                            <MenuItem>Number of Children</MenuItem>
                            <MenuItem>Children In Custody</MenuItem>
                            <MenuItem>Last City Permanent Residence</MenuItem>
                            <MenuItem>Decision</MenuItem>
                            <MenuItem>Additional Comments</MenuItem>
                        </MenuList>
                    </Menu>
                    <Text>Showing 12 results on this page</Text>
                </HStack>    
                <Table>
                        <Thead>
                            <Tr>
                            <Th>Initial Interview ID</Th>
                            <Th>Case Manager ID</Th>
                            <Th>Willingness</Th>
                            <Th>Employability </Th>
                            <Th>Attitude</Th>
                            <Th>Length of Sobriety</Th>
                            <Th>Completed TX</Th>
                            <Th>Drug Test Results</Th>
                            <Th>Homeless Episode One</Th>
                            <Th>Homeless Episode Two</Th>
                            <Th>Homeless Episode Three</Th>
                            <Th>Homeless Episode Four</Th>
                            <Th>Disabling Condition</Th>
                            <Th>Employed</Th>
                            <Th>Driver License</Th>
                            <Th>Number of Children</Th>
                            <Th>Children In Custody</Th>
                            <Th>Last City Permenant Residence</Th>
                            <Th>Decision</Th>
                            <Th>Additional Comments</Th>
                            </Tr>
                    </Thead>

                    <Tbody>

                        {items.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.id}</Td>
                                <Td>{item.initial_interview_id}</Td>
                                <Td>{item.cm_id }</Td>
                                <Td>{item.willingness }</Td>
                                <Td>{item.employability }</Td>
                                <Td>{item.attitude }</Td>
                                <Td>{item.length_of_sobriety }</Td>
                                <Td>{item.completed_tx }</Td>
                                <Td>{item.drug_test_results }</Td>
                                <Td>{item.homeless_episode_one }</Td>
                                <Td>{item.homeless_episode_two }</Td>
                                <Td>{item.homeless_episode_three }</Td>
                                <Td>{item.homeless_episode_four }</Td>
                                <Td>{item.disabling_condition }</Td>
                                <Td>{item.employed }</Td>
                                <Td>{item.driver_license }</Td>
                                <Td>{item.num_of_children }</Td>
                                <Td>{item.children_in_custody }</Td>
                                <Td>{item.last_city_perm_residence }</Td>
                                <Td>{item.decision }</Td>
                                <Td>{item.additional_comments }</Td>
                            </Tr>
                        ))}

                    </Tbody>
                </Table>
            </VStack>

        </>
    )
}   