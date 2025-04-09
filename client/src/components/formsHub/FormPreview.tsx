import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { FormItem } from "./formsTable";

export const FormPreview = ({
  formItem,
  isOpen,
  onClose,
}: {
  formItem: FormItem;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();

  const [formData, setFormData] = useState({});

  const userId = formItem.id;

  const titleToEndpoint: Record<FormItem["title"], string> = {
    "Initial Screeners": `/initialInterview/get-interview/${userId}`,
    "Intake Statistics": "",
    "Front Desk Monthly Statistics": `/frontDesk/get-stat/${userId}`,
    "Case Manager Monthly Statistics": `/caseManagers/${userId}`,
  };

  useEffect(() => {
    const getData = async () => {
      const endpoint = titleToEndpoint[formItem.title];

      if (endpoint == "") {
        setFormData({});

        return;
      }

      try {
        const response = await backend.get(`${endpoint}`);
        const data = response.data;

        setFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [backend, formItem]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="xl"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Flex
            justify="space-between"
            align="left"
          >
            <Text fontWeight="bold">Form Preview</Text>
            <Text>{formItem.title}</Text>
          </Flex>
        </DrawerHeader>

        <DrawerBody>
          <Button
            colorScheme="blue"
            mb={4}
          >
            Edit Form
          </Button>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>QUESTION</Th>
                <Th>ANSWER</Th>
              </Tr>
            </Thead>
            <Tbody></Tbody>
          </Table>

          <Button
            mt={6}
            colorScheme="blue"
            float="right"
          >
            Export Form
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
function parseHashedId(id: number) {
  throw new Error("Function not implemented.");
}
