import { Fragment, useEffect, useState } from "react";
import { Td, Tr } from "@chakra-ui/react";
import {
  NumberInputComponent,
  SelectInputComponent,
  TextInputComponent,
  TrueFalseComponent
} from "../intakeStatsForm/formComponents";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

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
  onRatingGridChange?: (fieldKey: string, rowKey: string, value: string) => void;
}

const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const DynamicFormTableBody = ({
  formData,
  formQuestions,
  handleChange,
  onRatingGridChange,
}: DynamicFormTableBodyProps) => {
  const { backend } = useBackendContext();
  const [caseManagers, setCaseManagers] = useState<Array<{ id: number; firstName?: string; lastName?: string; first_name?: string; last_name?: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await backend.get("/caseManagers");
        const list = Array.isArray(res.data)
          ? res.data
              .map((cm: { id: number | string; firstName?: string; lastName?: string; first_name?: string; last_name?: string }) => ({
                id: Number(cm.id),
                firstName: cm.firstName,
                lastName: cm.lastName,
                first_name: cm.first_name,
                last_name: cm.last_name,
              }))
              .filter((cm: { id: number }) => !Number.isNaN(cm.id))
          : [];
        setCaseManagers(list);
      } catch {
        // ignore
      }
    };
    load();
  }, [backend]);

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

          case "case_manager_select": {
            const options = caseManagers.map((cm) => {
              const first = cm.firstName ?? cm.first_name ?? "";
              const last = cm.lastName ?? cm.last_name ?? "";
              const label = `${first} ${last}`.trim() || `ID ${cm.id}`;
              return { label, value: String(cm.id) };
            });
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
                    value={typeof value === 'string' || typeof value === 'number' ? String(value) : ""}
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
            const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
            let gridData: Record<string, unknown> = {};
            if (typeof value === "string" && value) {
              try {
                gridData = JSON.parse(value) as Record<string, unknown>;
              } catch {
                gridData = {};
              }
            } else if (value && typeof value === "object" && !Array.isArray(value) && value !== null) {
              gridData = value as Record<string, unknown>;
            }
            if (gridConfig?.rows && gridConfig.rows.length > 0) {
              const options = (gridConfig?.columns ?? []).map((col) => ({
                label: col.label,
                value: col.value,
              }));
              const canEdit = !!onRatingGridChange && options.length > 0;
              return (
                <Fragment key={question.id}>
                  {gridConfig.rows.map((row) => {
                    const rowValue = gridData[row.key];
                    const valueStr = rowValue !== undefined && rowValue !== null ? String(rowValue) : "";
                    return (
                      <Tr key={`${question.id}-${row.key}`}>
                        <Td
                          fontSize="medium"
                          maxWidth="300px"
                          whiteSpace="normal"
                          wordBreak="break-word"
                          overflowWrap="break-word"
                        >
                          {question.questionText} - {row.label}
                        </Td>
                        <Td
                          maxWidth="400px"
                          whiteSpace="normal"
                          wordBreak="break-word"
                          overflowWrap="break-word"
                        >
                          {canEdit ? (
                            <SelectInputComponent
                              name={`${camelFieldKey}__${row.key}`}
                              value={valueStr}
                              onChange={(e) => {
                                onRatingGridChange!(camelFieldKey, row.key, e.target.value);
                              }}
                              options={options}
                              placeholder="Select..."
                              width="100%"
                            />
                          ) : (
                            <TextInputComponent
                              name={camelFieldKey}
                              value={
                                gridConfig?.columns?.length
                                  ? (gridConfig.columns.find((col: { value: string }) => String(col.value) === valueStr)?.label ?? valueStr)
                                  : valueStr
                              }
                              onChange={handleChange}
                              type="text"
                              width="100%"
                              disabled={true}
                            />
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Fragment>
              );
            }
            return (
              <Tr key={question.id}>
                <Td fontSize="medium" maxWidth="300px" whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                  {question.questionText}
                </Td>
                <Td maxWidth="400px" whiteSpace="normal" wordBreak="break-word" overflowWrap="break-word">
                  <TextInputComponent
                    name={camelFieldKey}
                    value={typeof value === "string" ? value : JSON.stringify(gridData ?? value ?? {})}
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

