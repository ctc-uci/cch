import { useEffect, useState } from 'react';
import VolunteersTable from './VolunteersTable';
import {
  Box,
  Grid,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
import VolunteersStatistics from './VolunteersStatistics';
const VolunteersPage = () => {
  // const { backend } = useBackendContext();
  // const [volunteers, setVolunteers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchVolunteers = async () => {
  //     try {
  //       const response = await backend.get('/volunteers');
  //       setVolunteers(response.data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchVolunteers();
  // }, [backend]);

  // if (loading) return <Text>Loading...</Text>;
  // if (error) return <Text>Error: {error}</Text>;


  return (
    <HStack align="start" spacing="24px" paddingTop="24px" paddingLeft="24px">
      <VStack width="30%">
        <Heading fontSize="24px">Volunteer Tracking</Heading>
        <Text fontSize="14px">Last Updated: MM/DD/YYYY HH:MM XX</Text>
        <VolunteersStatistics/>
      </VStack>
      <VolunteersTable/>
    </HStack>
  );
};

export default VolunteersPage;
