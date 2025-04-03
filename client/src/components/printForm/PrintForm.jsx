import { useEffect, useRef, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { PDFDownloadLink } from '@react-pdf/renderer';

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
  const formData = useRef(<></>);
  const [formDataTest, setFormDataTest] = useState(null);

  useEffect(() => {
    async function printForm() {
      try {
        let response, data;
        switch (formType) {
          case 'Success Story':
            response = await backend.get(`/successStory/${formId}`);
            data = response.data;
            formData.current = <SuccessStoryForm successStoryData={data} />;
            break;
          case 'Random Survey':
            response = await backend.get(`/randomSurvey/${formId}`);
            data = [response.data];
            formData.current = <RandomSurveyForm randomSurveyData={data} />;
            break;
          case 'Exit Survey':
            response = await backend.get(`/exitSurvey/${formId}`);
            data = response.data;
            formData.current = <ExitSurvey exitSurveyData={data["data"]} />;
            break;
          case 'Client Interview Screener':
            response = await backend.get(`/screenerComment/${formId}`);
            data = response.data;
            formData.current = <ClientInterviewScreenerForm clientInterviewScreenerData={data} />;
            break;
          case 'Initial Screeners':
            response = await backend.get(`/initialInterview/id/${formId}`);
            data = response.data;
            formData.current = <InitialScreenerForm clientInitialScreeningData={data} />;
            break;
          case 'Client Tracking Statistics (Intake Statistics':
            response = await backend.get(`/intakeStatsForm/${formId}`);
            data = [response.data];
            formData.current = <IntakeStatsForm intakeStatsData={data} />;
            break;
          case 'Front Desk Monthly Statistics':
            response = await backend.get(`/frontDesk/${formId}`);
            data = [response.data];
            formData.current = <FrontDeskMonthlyStatsForm frontDeskMonthlyStatsData={data[0]} />;
            break;
          case 'Case Manager Monthly Statistics':
            response = await backend.get(`/caseManagerMonthlyStats/id/${formId}`);
            data = [response.data];
            formData.current = <CaseManagerMonthlyStatsForm caseManagerMonthlyStatsData={data[0]} />;
            break;
        }
        setFormDataTest(data);
      } catch (e) {
        console.log(`${formType} response was not created: ${e.message}`);
      }
    }
    printForm();
  }, [formType, formId, backend]);

  return (
    <PDFDownloadLink document={formData.current} fileName='form.pdf'>
      Export Form
    </PDFDownloadLink>
  );
}
