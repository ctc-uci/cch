  import { useBackendContext } from "../../contexts/hooks/useBackendContext";
  import { useEffect, useState } from "react";
  
  import {
    Box,
    Icon,
    For,
    Stack,
    Table,
    Text,
    Image,
    
  } from "@chakra-ui/react";

  export const ClientChildren = () => {
    const {backend} = useBackendContext();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchData = async () => {
        try {
          const response = await backend.())) //fill with request from frontend routes last time
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setItems(data); // Assuming 'data' is the array of children
          setLoading(false); // Turn off loading once data is fetched
        } catch (err) {
          setError(err.message); // Set error if there's a failure
          setLoading(false);
        }
      };
      return (
        <Stack gap="10">
          <Table.Root size="md">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>DOB</Table.ColumnHeader>
                <Table.ColumnHeader>Age</Table.ColumnHeader>
                <Table.ColumnHeader>Custody</Table.ColumnHeader>
                <Table.ColumnHeader>School</Table.ColumnHeader>
                <Table.ColumnHeader>Grade</Table.ColumnHeader>
                <Table.ColumnHeader>Comments</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.dob}</Table.Cell>
                  <Table.Cell>{item.age}</Table.Cell>
                  <Table.Cell>{item.custody}</Table.Cell>
                  <Table.Cell>{item.school}</Table.Cell>
                  <Table.Cell>{item.grade}</Table.Cell>
                  <Table.Cell>{item.comments}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Stack>
      );
  }