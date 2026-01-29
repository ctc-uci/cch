import { useEffect, useState } from "react";
import { ClientReviewPage } from "./ClientReviewPage";
import { ReviewPage } from "./ReviewPage";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { IconButton, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RandomSurveyConfirmation } from "./RandomSurveyConfirmation";
import { ChevronLeftIcon } from "@chakra-ui/icons/ChevronLeft";

type CaseManager = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
};

export const RandomClientSurvey = () => {
    const [page, setPage] = useState(1);
    const { backend } = useBackendContext();
    const toast = useToast();
    const params = useParams();

    const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [surveyData, setSurveyData] = useState<Record<string, unknown>>({});
    
    // Get language from URL params, default to English if not specified
    const language = params.language === "Spanish" ? "spanish" : "english";

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
    }, [backend]);

    const handleCancel = () => {
      // Just go back to page 1 without clearing data so user can edit their answers
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
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast({
          title: "An error occurred",
          description: `Random survey response was not created: ${errorMessage}`,
          status: "error",
        });
        navigate("/landing-page");
      }
    };
    
    return (
        <>
        <IconButton
          aria-label="Back"
          icon={<ChevronLeftIcon boxSize={8} />}
          onClick={(e) => {
            if (page === 1) {
              navigate("/choose-form");
            } else {
              handleCancel();
            }
          }}
          colorScheme="blue"
          variant="ghost"
          size="lg"
          position="absolute"
          left={5}
          top={5}
      />
            {page === 1 && (
                <ClientReviewPage
                surveyData={surveyData}
                setSurveyData={setSurveyData}
                errors={errors}
                setErrors={setErrors}
                onNext={() => setPage(2)}
                caseManagers={caseManagers}
                language={language}
                />
            )}

            {page === 2 && (
                <ReviewPage
                surveyData={surveyData}
                caseManagers={caseManagers}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                language={language}
                />
            )}

            {page === 3 && <RandomSurveyConfirmation onExit={async () => navigate("/choose-form")} />}
        </>
    );
};
