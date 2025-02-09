import { Navbar } from "../Navbar"
import {
    Button,
    Heading,
    Input,
    VStack,
    HStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
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
    const [searchKey, setSearchKey] = useState("");
    const [sortKey, setSortKey] = useState("id");
    
    useEffect(() => {
        const getData = async () => {
          try {
            let screeningCommentsResponse;
            if(searchKey){
                screeningCommentsResponse = await backend.get(
                `/screenerComment?search=${searchKey}&sortBy=${sortKey}`
                );
            } else {
                screeningCommentsResponse = await backend.get(
                `/screenerComment?sortBy=${sortKey}`
                )
            }
            setItems(screeningCommentsResponse.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        getData();

      }, [searchKey,sortKey]);
    
    const menuItems = {
        id: "ID",
        initialInterviewId: "Initial Interview ID",
        cmId: "Case Manager ID",
        willingness: "Willingness",
        employability: "Employability",
        attitude: "Attitude",
        lengthOfSobriety: "Length of Sobriety",
        completedTx: "Completed Tx",
        drugTestResults: "Drug Test Results",
        homelessEpisodeOne: "Homeless Episode One",
        homelessEpisodeTwo: "Homeless Episode Two",
        homelessEpisodeThree: "Homeless Episode Three",
        homelessEpisodeFour: "Homeless Episode Four",
        disablingCondition: "Disabling Condition",
        employed: "Employed",
        driverLicense: "Driver License",
        numOfChildren: "Number of Children",
        childrenInCustody: "Children in Custody",
        lastCityPermResidence: "Last City Permanent Residence",
        decision: "Decision",
        additionalComments: "Additional Comments"
    }

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
                    <Input placeholder='Search' onChange={(e) => setSearchKey(e.target.value)}/>
                    <Menu>
                        <MenuButton as={Button} >
                            Sort
                        </MenuButton>
                        <MenuList >
                            { Object.entries(menuItems).map(([key,value]) => 
                            (<MenuItem onClick={()=>setSortKey(key)}>{value}</MenuItem>))
                            }
                        </MenuList>
                    </Menu>
                    <Text>Showing {Object.keys(items).length} results on this page</Text>
                </HStack>    
                <Table>
                        <Thead>
                            <Tr>
                            { Object.entries(menuItems).map(([key,value]) => 
                            (<Th>{value}</Th>))}
                            </Tr>
                    </Thead>
                    <Tbody>

                        {items.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.id}</Td>
                                <Td>{item.initialInterviewId}</Td>
                                <Td>{item.cmId }</Td>
                                <Td>{item.willingness }</Td>
                                <Td>{item.employability }</Td>
                                <Td>{item.attitude }</Td>
                                <Td>{item.lengthOfSobriety }</Td>
                                <Td>{item.completedTx }</Td>
                                <Td>{item.drugTestResults }</Td>
                                <Td>{item.homelessEpisodeOne }</Td>
                                <Td>{item.homelessEpisodeTwo }</Td>
                                <Td>{item.homelessEpisodeThree }</Td>
                                <Td>{item.homelessEpisodeFour }</Td>
                                <Td>{item.disablingCondition }</Td>
                                <Td>{item.employed }</Td>
                                <Td>{item.driverLicense }</Td>
                                <Td>{item.numOfChildren }</Td>
                                <Td>{item.childrenInCustody }</Td>
                                <Td>{item.lastCityPermResidence }</Td>
                                <Td>{item.decision }</Td>
                                <Td>{item.additionalComments }</Td>
                            </Tr>
                        ))}

                    </Tbody>
                </Table>
            </VStack>

        </>
    )
}   