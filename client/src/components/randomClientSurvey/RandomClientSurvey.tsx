import { useEffect, useState } from "react";
import { ClientReviewPage } from "./ClientReviewPage";
import { ReviewPage } from "./ReviewPage";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RandomSurveyConfirmation } from "./RandomSurveyConfirmation";

type CaseManager = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
};

type SurveyData = {
  date: string | Date;
  cch_qos: number;
  cm_qos: number;
  courteous?: boolean;
  informative?: boolean;
  prompt_and_helpful?: boolean;
  entry_quality: number;
  unit_quality: number;
  clean: number;
  overall_experience: number;
  case_meeting_frequency: string;
  lifeskills?: boolean;
  recommend?: boolean;
  recommend_reasoning: string;
  make_cch_more_helpful: string;
  cm_id: number;
  cm_feedback: string;
  other_comments: string;
};

export const RandomClientSurvey = () => {
    const [page, setPage] = useState(1);
    const { backend } = useBackendContext();
    const toast = useToast();

    const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
    const navigate = useNavigate();


    

      const [errors, setErrors] = useState({
        qualityQuestions: false,
        courteous: false,
        informative: false,
        prompt_and_helpful: false,
        case_meeting_frequency: false,
        lifeskills: false,
        recommend: false,
        recommend_reasoning: false,
        date: false,
        cm_id: false,
    });

    const initialEmptySurveyData: SurveyData = {
      date: "",
      cch_qos: 0,
      cm_qos: 0,
      courteous: undefined,
      informative: undefined,
      prompt_and_helpful: undefined,
      entry_quality: 0,
      unit_quality: 0,
      clean: 0,
      overall_experience: 0,
      case_meeting_frequency: "",
      lifeskills: undefined,
      recommend: undefined,
      recommend_reasoning: "",
      make_cch_more_helpful: "",
      cm_id: 0,
      cm_feedback: "",
      other_comments: "",
    };

    const [surveyData, setSurveyData] = useState<SurveyData>(initialEmptySurveyData);

    useEffect(() => {
        const fetchCaseManagers = async () => {
            try {
            const res = await backend.get("/caseManagers");
            setCaseManagers(res.data);
            } catch (error) {
            console.error("Failed to fetch case managers:", error.message);
            }
        };

        fetchCaseManagers();
    }, []);

    const handleCancel = () => {
      setSurveyData(initialEmptySurveyData);
      setPage(1);
    };
    
    const handleSubmit = async () => {
      try {
        await backend.post("/randomSurvey", surveyData);
        toast({
          title: "Survey submitted successfully",
          description: "Thank you for your feedback!",
          status: "success",
        });

        setPage(3);
      } catch (error) {
        toast({
          title: "An error occurred",
          description: `Random survey response was not created: ${error.message}`,
          status: "error",
        });
        navigate("/landing-page");
      }
    };
    
    return (
        <>
            {page === 1 && (
                <ClientReviewPage
                surveyData={surveyData}
                setSurveyData={setSurveyData}
                errors={errors}
                setErrors={setErrors}
                onNext={() => setPage(2)}
                caseManagers={caseManagers}
                />
            )}

            {page === 2 && (
                <ReviewPage
                surveyData={surveyData}
                caseManagers={caseManagers}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                />
            )}

            {page === 3 && <RandomSurveyConfirmation onExit={() => navigate("/")} />}
        </>
    );
};
