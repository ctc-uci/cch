import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

import { MonthlyStat } from "../../types/monthlyStat";

const TableCM = ( { items } : MonthlyStat[] ) => {
    console.log(items);
    return (
        <TableContainer>
        <Table variant='simple'>
          <Thead >
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
    
          {items.map((item: MonthlyStat, index: number) => (
            <Tr key={index}>
                <Td>{item.id}</Td>
                <Td>{item.date}</Td>
                <Td>{item.cmId}</Td>
                <Td>{item.babiesBorn}</Td>
                <Td>{item.enrolledInSchool}</Td>
                <Td>{item.earnedDegree}</Td>
                <Td>{item.earnedDriversLicense}</Td>
                <Td>{item.reunifiedWithChildren}</Td>
                <Td>{item.womensBirthdays}</Td>
                <Td>{item.childrensBirthdays}</Td>
                <Td>{item.birthdayGiftCardValues}</Td>
                <Td>{item.foodCardValues}</Td>
                <Td>{item.busPasses}</Td>
                <Td>{item.gasCardsValue}</Td>
                <Td>{item.phoneContacts}</Td>
                <Td>{item.inpersonContacts}</Td>
                <Td>{item.emailContacts}</Td>
                <Td>{item.interviewsScheduled}</Td>
                <Td>{item.interviewsConducted}</Td>
                <Td>{item.positiveTests}</Td>
                <Td>{item.noCallNoShows}</Td>
                <Td>{item.other}</Td>
            </Tr>    
        
        ))}
    
          </Tbody>
        </Table>
      </TableContainer>
        
  
    );
}

export default TableCM;