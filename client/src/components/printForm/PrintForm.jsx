import { useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@chakra-ui/react";

import DynamicFormPDF from "./forms/DynamicFormPDF";
import IntakeStatsForm from "./forms/IntakeStatsForm";
import FrontDeskMonthlyStatsForm from "./forms/FrontDeskMonthlyStatsForm";
import CaseManagerMonthlyStatsForm from "./forms/CaseManagerMonthlyStatsForm";

export default function PrintForm({ formType, formId }) {
  const { backend } = useBackendContext();
  const [loading, setLoading] = useState(false);

  // Map formType to formId number for dynamic forms
  const getFormIdNumber = (type) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("initial") || typeLower.includes("screener")) return 1;
    if (typeLower.includes("exit")) return 2;
    if (typeLower.includes("success")) return 3;
    if (typeLower.includes("random")) return 4;
    return null;
  };

  // Check if formId is a UUID (session-based dynamic form)
  const isUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return typeof id === 'string' && uuidRegex.test(id);
  };

  // Forms that support dynamic questions/answers
  const isDynamicForm = (type) => {
    const dynamicTypes = [
      "Success Story",
      "Random Survey",
      "Exit Survey",
      "Client Interview Screener",
      "Initial Screeners",
      "Initial Interview"
    ];
    return dynamicTypes.includes(type);
  };

  // Forms that use legacy components (statistics forms)
  const isLegacyForm = (type) => {
    const legacyTypes = [
      "Client Tracking Statistics (Intake Statistics)",
      "Front Desk Monthly Statistics",
      "Case Manager Monthly Statistics"
    ];
    return legacyTypes.includes(type);
  };

  const handleGeneratePdf = async () => {
    setLoading(true);
    try {
      let documentComponent;

      // Handle legacy statistics forms (keep existing logic)
      if (isLegacyForm(formType)) {
        let response, data;
        switch (formType) {
          case "Client Tracking Statistics (Intake Statistics)":
            response = await backend.get(`/intakeStatsForm/${formId}`);
            data = response.data;
            documentComponent = <IntakeStatsForm intakeStatsData={data} />;
            break;
          case "Front Desk Monthly Statistics":
            response = await backend.get(`/frontDesk/${formId}`);
            data = [response.data];
            documentComponent = (
              <FrontDeskMonthlyStatsForm frontDeskMonthlyStatsData={data[0]} />
            );
            break;
          case "Case Manager Monthly Statistics":
            response = await backend.get(`/caseManagerMonthlyStats/${formId}`);
            data = [response.data];
            documentComponent = (
              <CaseManagerMonthlyStatsForm
                caseManagerMonthlyStatsData={data[0]}
              />
            );
            break;
          default:
            throw new Error("Invalid form type");
        }
      } 
      // Handle dynamic forms with questions and answers
      else if (isDynamicForm(formType)) {
        const formIdNumber = getFormIdNumber(formType);
        const formIdIsUUID = isUUID(formId);

        if (!formIdNumber && !formIdIsUUID) {
          throw new Error(`Unable to determine form ID for type: ${formType}`);
        }

        // Fetch form questions
        const questionsResponse = await backend.get(
          `/intakeResponses/form/${formIdNumber}/questions?includeHidden=false`
        );
        const questions = questionsResponse.data || [];

        // Fetch form data
        let formData = {};
        if (formIdIsUUID) {
          // Fetch from intake_responses using session_id
          const response = await backend.get(`/intakeResponses/session/${formId}`);
          formData = response.data || {};
        } else {
          // Try to fetch from dynamic endpoint first, fallback to legacy endpoints
          try {
            // Try dynamic endpoint if available
            const response = await backend.get(`/intakeResponses/session/${formId}`);
            formData = response.data || {};
          } catch (_error) {
            // Fallback to legacy endpoints
            let endpoint = '';
            switch (formType) {
              case "Success Story":
                endpoint = `/successStory/${formId}`;
                break;
              case "Random Survey":
                endpoint = `/randomSurvey/${formId}`;
                break;
              case "Exit Survey":
                endpoint = `/exitSurvey/${formId}`;
                break;
              case "Client Interview Screener":
                endpoint = `/screenerComment/${formId}`;
                break;
              case "Initial Screeners":
              case "Initial Interview":
                endpoint = `/initialInterview/id/${formId}`;
                break;
              default:
                throw new Error(`No endpoint found for form type: ${formType}`);
            }
            const response = await backend.get(endpoint);
            // Handle different response structures
            if (formType === "Exit Survey") {
              formData = response.data?.data?.[0] || response.data?.[0] || response.data || {};
            } else if (formType === "Random Survey") {
              formData = Array.isArray(response.data) ? response.data[0] : response.data || {};
            } else {
              formData = Array.isArray(response.data) ? response.data[0] : response.data || {};
            }
          }
        }

        // Create dynamic PDF component with questions and answers
        documentComponent = (
          <DynamicFormPDF
            formTitle={formType}
            questions={questions}
            formData={formData}
          />
        );
      } else {
        throw new Error(`Unsupported form type: ${formType}`);
      }

      // Generate the PDF blob
      const pdfBlob = await pdf(documentComponent).toBlob();

      // Create a URL for the PDF blob and open it
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfBlobUrl, "_blank");
    } catch (e) {
      console.error(`${formType} response was not created: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      colorScheme="blue"
      size="sm"
      onClick={handleGeneratePdf}
      isLoading={loading}
    >
      Export Form
    </Button>
  );
}
