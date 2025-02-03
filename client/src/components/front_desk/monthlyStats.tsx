import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useParams } from "react-router-dom";
import { Table, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react"

interface MonthlyStats {
    id: number,
    totalOfficeVisits: number,
    totalCalls: number,
    totalUnduplicatedCalles: number,
    totalVisitsToPantryAndDonationsRoom: number,
    totalNumberOfPeopleServedInPantry: number,
    totalVisitsToPlacentiaPantry: number,
    totalNumberOfPeopleServedInPlacentiaPantry: number,
  }

export const FrontDeskMonthlyStats = () => {
    const { backend } = useBackendContext();
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams<{ id: string }>();
  

    const fetchFrontDesk = async () => {
        try {
            const response = await backend.get(`/frontDeskMonthlyStats/`);
            console.log(response.data);
            setMonthlyStats(response.data); // Adjust this if the response structure is different
        }catch (err){ 
            setError(err.message);

        }
    };

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          await Promise.all([fetchFrontDesk()]);
          setLoading(false);
        };
        fetchData();
      }, []); 

    

    return (<p>hello</p>/*
        <Table variant="simple">
            <Thead>
                <Tr>
                <Th>Total Office Visits</Th>
                <Th>Total # of calls</Th>
                <Th>Total # of unduplicated calls</Th>
                <Th>Total # of visits to the HB pantry/donations room</Th>
                <Th>Total # of people served in the HB pantry/donations</Th>
                <Th>Total # of visits to the Placentia pantry/donations room</Th>
                <Th>Total # of people served in the Placentia pantry/donations</Th>
                </Tr>
            </Thead>
            <Tbody>
                {monthlyStats.map((stat, index) => (
                <Tr key={index}>
                    <Td>{stat.totalOfficeVisits}</Td>
                    <Td>{stat.totalCalls}</Td>
                    <Td>{stat.totalUnduplicatedCalles}</Td>
                    <Td>{stat.totalVisitsToPantryAndDonationsRoom}</Td>
                    <Td>{stat.totalNumberOfPeopleServedInPantry}</Td>
                    <Td>{stat.totalVisitsToPlacentiaPantry}</Td>
                    <Td>{stat.totalNumberOfPeopleServedInPlacentiaPantry}</Td>
                </Tr>
                ))}
            </Tbody>
        </Table>*/
    )
};