import React, { useState } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FormsProps } from "../types";
import PrintForm from "../../printForm/PrintForm";
import ExitSurveyModal from "../editFormModals/ExitSurveyModal";
import SuccessStoryModal from "../editFormModals/SuccessStoryModal";
import InitialInterviewModal from "../editFormModals/InitialInterviewModal";

function Forms({ forms }: FormsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const handleRowClick = (form: any) => {

    if (form.type === "Exit Survey") {
      setSelectedForm(form);
      onOpen();
    }
    if (form.type === "Success Story") {
      setSelectedForm(form);
      onOpen();
    }
    if (form.type === "Initial Interview") {
      setSelectedForm(form);
      onOpen();
    }
  };

  return (
    <Box mb="2vh" p={2} overflow="hidden">
      <TableContainer
        sx={{
          overflowX: "auto",
          overflowY: "auto",
          maxWidth: "50%",
          border: "1px solid gray",
          borderRadius: "md",
        }}
      >
        <Table variant="simple">
          <Thead backgroundColor="white" position="sticky" top={0}>
            <Tr>
              <Th fontSize="md" color="black" width="40%">
                Date
              </Th>
              <Th fontSize="md" color="black" width="40%">
                Title
              </Th>
              <Th fontSize="md" color="black" width="20%" textAlign="center">
                Export
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr
                key={form.title}
                onClick={() => handleRowClick(form)}
                _hover={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
              >
                <Td fontSize="sm">
                  {new Date(form.date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })}
                </Td>
                <Td fontSize="sm">{form.title || form.type}</Td>
                <Td
                  fontSize="sm"
                  textAlign="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PrintForm
                    formType={
                      form.type === "Initial Interview"
                        ? "Initial Screeners"
                        : form.type
                    }
                    formId={form.id}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {selectedForm && selectedForm.type === "Exit Survey" && (
        <ExitSurveyModal
          form={selectedForm}
          isOpen={isOpen}
          onClose={() => {
            setSelectedForm(null);
            onClose();
          }}
        />
      )}
      {selectedForm && selectedForm.type === "Success Story" && (
        <SuccessStoryModal
          form={selectedForm}
          isOpen={isOpen}
          onClose={() => {
            setSelectedForm(null);
            onClose();
          }}
        />
      )}
      {selectedForm && selectedForm.type === "Initial Interview" && (
        <InitialInterviewModal
          form={selectedForm}
          isOpen={isOpen}
          onClose={() => {
            setSelectedForm(null);
            onClose();
          }}
        />
      )}
    </Box>
  );
}

export default Forms;
