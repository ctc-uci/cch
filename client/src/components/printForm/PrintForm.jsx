import { useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { Button } from "@chakra-ui/react";

import SuccessStoryForm from "./forms/SuccessStoryForm";
import RandomSurveyForm from "./forms/RandomSurveyForm";
import ExitSurvey from "./forms/ExitSurveyForm";
import ClientInterviewScreenerForm from "./forms/ClientInterviewScreenerForm";
import InitialScreenerForm from "./forms/InitialScreenerForm";
import IntakeStatsForm from "./forms/IntakeStatsForm";
import FrontDeskMonthlyStatsForm from "./forms/FrontDeskMonthlyStatsForm";
import CaseManagerMonthlyStatsForm from "./forms/CaseManagerMonthlyStatsForm";

export default function PrintForm({ formType, formId }) {
  const { backend } = useBackendContext();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = async () => {
    setLoading(true);
    try {
      let response, data, documentComponent;

      switch (formType) {
        case "Success Story":
          response = await backend.get(`/successStory/${formId}`);
          data = response.data;
          documentComponent = <SuccessStoryForm successStoryData={data} />;
          break;
        case "Random Survey":
          response = await backend.get(`/randomSurvey/${formId}`);
          data = [response.data];
          documentComponent = <RandomSurveyForm randomSurveyData={data} />;
          break;
        case "Exit Survey":
          response = await backend.get(`/exitSurvey/${formId}`);
          data = response.data;
          documentComponent = <ExitSurvey exitSurveyData={data["data"]} />;
          break;
        case "Client Interview Screener":
          response = await backend.get(`/screenerComment/${formId}`);
          data = response.data;
          documentComponent = (
            <ClientInterviewScreenerForm clientInterviewScreenerData={data} />
          );
          break;
        case "Initial Screeners":
          response = await backend.get(`/initialInterview/id/${formId}`);
          data = response.data;
          documentComponent = (
            <InitialScreenerForm clientInitialScreeningData={data} />
          );
          break;
        case "Client Tracking Statistics (Intake Statistics":
          response = await backend.get(`/intakeStatsForm/${formId}`);
          data = [response.data];
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
          response = await backend.get(`/caseManagerMonthlyStats/id/${formId}`);
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

      // Generate the PDF blob
      const pdfBlob = await pdf(documentComponent).toBlob();

      // Create a URL for the PDF blob
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfBlobUrl);

      // Automatically redirect to the PDF
      window.open(pdfBlobUrl, "_blank");
    } catch (e) {
      console.error(`${formType} response was not created: ${e.message}`);
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
