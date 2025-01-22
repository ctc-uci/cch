import { useEffect, useState } from "react";

import {
  Button,
  Link as ChakraLink,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { User } from "../../types/user";
import FormCM from "./form";
import TableCM from "./table";
import { MonthlyStat } from "../../types/monthlyStat";


export const CaseManager = () => {
  // const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  // const { role } = useRoleContext();

  // const [users, setUsers] = useState<User[] | undefined>();

  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);
    
  useEffect(() => {
    const getData = async () => {
      try {
        const monthlyStatsResponse = await backend.get(`/caseManagerMonthlyStats`);

        console.log(monthlyStatsResponse.data)
        setMonthlyData(monthlyStatsResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await backend.get("/users");
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchData();
  // }, [backend]);

  return (
    <div>
      <TableCM items={monthlyData}/>
      <FormCM/>
    </div>
    
  );
};
