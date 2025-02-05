import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {
  Text,
  Input,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  HStack,
  } from "@chakra-ui/react";
import { MonthlyStat } from "../../types/monthlyStat";
import { useParams } from "react-router-dom";


interface MonthlyValues {
  id: number,
  date: string,
  cm_id: number,
  babies_born: number,
	enrolled_in_school: number,
	earned_degree: number,
	earned_drivers_license: number,
	reunified_with_children: number,
	womens_birthdays: number,
	childrens_birthdays: number,
	birthday_gift_card_values: number,
	food_card_values: number,
	bus_passes: number,
	gas_cards_value: number,
	phone_contacts: number,
	inperson_contacts: number,
	email_contacts: number,
	interviews_scheduled: number,
	interviews_conducted: number,
	positive_tests: number,
	no_call_no_shows: number,
	other: number

}

export const MonthlyStatView = () => {
  const { backend } = useBackendContext();
  const [monthlyValues, setMonthlyValues] = useState<MonthlyValues[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const [id, SetId] = useState<number>(0);
  
  SetId(parseInt(params.id || '0'));



  //Fetches db values
  const fetchMonthlyValue = async (id: number) => {
    try {
        const response = await backend.get(`/cm_monthly_stats/${id}`);
        // console.log(response.data);
        setMonthlyValues(response.data);
    }catch (err){ 
        setError(err.message);
    }
  };



  useEffect(() => {
    const fetchData = async (id: number) => {
      setLoading(true);
      await Promise.all([fetchMonthlyValue(id)]);
      setLoading(false);
    };

    fetchData(id);
  }, []); 


  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
          <Th>id</Th>
            <Th>date</Th>
            <Th>cm id</Th>
            <Th>babies born</Th>
            <Th>enrolled in school</Th>
            <Th>earned degree</Th>
            <Th>earned drivers license</Th>
            <Th>reunified with children</Th>
            <Th>womens birthdays</Th>
            <Th>childrens birthdays</Th>
            <Th>birthday gift card values</Th>
            <Th>food card values</Th>
            <Th>bus passes</Th>
            <Th>gas cards value</Th>
            <Th>phone contacts</Th>
            <Th>inperson contacts</Th>
            <Th>email contacts</Th>
            <Th>interviews scheduled</Th>
            <Th>interviews conducted</Th>
            <Th>positive tests</Th>
            <Th>no call no shows</Th>
            <Th>other</Th>
          </Tr>
        </Thead>
        <Tbody>
          {monthlyValues.map((values: MonthlyValues, index: number) => (
            <Tr key={index}>
            <Td>{values.id}</Td>
            <Td>{values.date}</Td>
            <Td>{values.cm_id}</Td>
            <Td>{values.babies_born}</Td>
            <Td>{values.enrolled_in_school}</Td>
            <Td>{values.earned_degree}</Td>
            <Td>{values.earned_drivers_license}</Td>
            <Td>{values.reunified_with_children}</Td>
            <Td>{values.womens_birthdays}</Td>
            <Td>{values.childrens_birthdays}</Td>
            <Td>{values.birthday_gift_card_values}</Td>
            <Td>{values.food_card_values}</Td>
            <Td>{values.bus_passes}</Td>
            <Td>{values.gas_cards_value}</Td>
            <Td>{values.phone_contacts}</Td>
            <Td>{values.inperson_contacts}</Td>
            <Td>{values.email_contacts}</Td>
            <Td>{values.interviews_scheduled}</Td>
            <Td>{values.interviews_conducted}</Td>
            <Td>{values.positive_tests}</Td>
            <Td>{values.no_call_no_shows}</Td>
            <Td>{values.other}</Td>
          </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};