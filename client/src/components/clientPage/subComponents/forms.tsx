import { useState } from "react";
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
import { FormsProps, FormItems } from "../types";
import PrintForm from "../../printForm/PrintForm";
import DynamicFormModal from "../editFormModals/DynamicFormModal";

function Forms({ forms }: FormsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForm, setSelectedForm] = useState<FormItems | null>(null);

  const handleRowClick = (form: FormItems) => {

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
                key={`${form.type}-${form.id}-${form.date}`}
                onClick={() => handleRowClick(form)}
                _hover={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
              >
                <Td fontSize="sm">
                  {new Date(form.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
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
        <DynamicFormModal
          form={selectedForm}
          isOpen={isOpen}
          onClose={() => {
            setSelectedForm(null);
            onClose();
          }}
          formId={2}
        />
      )}
      {selectedForm && selectedForm.type === "Success Story" && (
        <DynamicFormModal
          form={selectedForm}
          isOpen={isOpen}
          onClose={() => {
            setSelectedForm(null);
            onClose();
          }}
          formId={3}
        />
      )}
      {selectedForm && selectedForm.type === "Initial Interview" && (
        <DynamicFormModal
          form={selectedForm}
          isOpen={isOpen}
          onClose={() => {
            setSelectedForm(null);
            onClose();
          }}
          formId={1}
        />
      )}
    </Box>
  );
}

export default Forms;
