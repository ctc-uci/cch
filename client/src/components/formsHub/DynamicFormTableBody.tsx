import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
  TrueFalseComponent
} from "../intakeStatsForm/formComponents";

interface FormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: string;
  displayOrder: number;
  isVisible: boolean;
  options?: unknown;
}

interface DynamicFormTableBodyProps {
  formData: Record<string, unknown>;
  formQuestions: FormQuestion[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const DynamicFormTableBody = ({
  formData,
  formQuestions,
  handleChange,
}: DynamicFormTableBodyProps) => {
  const visibleQuestions = formQuestions
    .filter(q => q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      {visibleQuestions.map((question) => {
        const camelFieldKey = toCamelCase(question.fieldKey);
        const value = formData[camelFieldKey] ?? formData[question.fieldKey] ?? "";

        switch (question.questionType) {
          case "number":
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <NumberInputComponent
                    name={camelFieldKey}
                    value={typeof value === 'number' ? value : undefined}
                    onChange={handleChange}
                    width="100%"
                  />
                </Td>
              </Tr>
            );

          case "boolean":
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <TrueFalseComponent
                    name={camelFieldKey}
                    value={typeof value === 'boolean' ? value : undefined}
                    onChange={handleChange}
                    width="100%"
                  />
                </Td>
              </Tr>
            );

          case "date":
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <TextInputComponent
                    name={camelFieldKey}
                    value={typeof value === 'string' ? value : ""}
                    onChange={handleChange}
                    type="date"
                    width="100%"
                  />
                </Td>
              </Tr>
            );

          case "select": {
            const options = Array.isArray(question.options) 
              ? question.options.map((opt: { value: string; label: string }) => ({
                  label: opt.label,
                  value: opt.value,
                }))
              : [];
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <SelectInputComponent
                    name={camelFieldKey}
                    value={typeof value === 'string' ? value : ""}
                    onChange={handleChange}
                    options={options}
                    placeholder={`Select ${question.questionText}`}
                    width="100%"
                  />
                </Td>
              </Tr>
            );
          }

          case "textarea":
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <TextInputComponent
                    name={camelFieldKey}
                    value={typeof value === 'string' ? value : ""}
                    onChange={handleChange}
                    type="text"
                    width="100%"
                  />
                </Td>
              </Tr>
            );

          case "rating_grid": {
            // Format rating grid as readable text
            const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
            let displayValue = "";
            
            if (value && typeof value === "object" && !Array.isArray(value) && value !== null) {
              if (gridConfig?.rows && gridConfig?.columns && gridConfig.columns.length > 0) {
                const gridData = value as Record<string, unknown>;
                const formattedRows: string[] = [];
                
                gridConfig.rows.forEach((row) => {
                  const rowValue = gridData[row.key];
                  if (rowValue) {
                    const column = gridConfig.columns?.find(col => col.value === rowValue);
                    if (column) {
                      formattedRows.push(column.label);
                    }
                  }
                });
                
                displayValue = formattedRows.length > 0 ? formattedRows.join(", ") : "";
              } else {
                // Fallback to JSON if config is missing
                try {
                  displayValue = JSON.stringify(value);
                } catch {
                  displayValue = String(value);
                }
              }
            } else if (typeof value === 'string') {
              displayValue = value;
            }
            
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <TextInputComponent
                    name={camelFieldKey}
                    value={displayValue}
                    onChange={handleChange}
                    type="text"
                    width="100%"
                    disabled={true}
                  />
                </Td>
              </Tr>
            );
          }

          default:
            // text, textarea, etc.
            return (
              <Tr key={question.id}>
                <Td 
                  fontSize="medium"
                  maxWidth="300px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  {question.questionText}
                </Td>
                <Td
                  maxWidth="400px"
                  whiteSpace="normal"
                  wordBreak="break-word"
                  overflowWrap="break-word"
                >
                  <TextInputComponent
                    name={camelFieldKey}
                    value={typeof value === 'string' || typeof value === 'number' ? String(value) : ""}
                    onChange={handleChange}
                    type="text"
                    width="100%"
                  />
                </Td>
              </Tr>
            );
        }
      })}
    </>
  );
};

