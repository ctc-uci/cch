import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import FormCM from "./form";

export const CaseManager = () => {
  const { backend } = useBackendContext();
  const [refreshStatus, setRefreshStatus] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);

  //wasn't sure if the table was completely depreciated now didnt wanna delete it yet  
  useEffect(() => {
    const getData = async () => {
      try {
        const monthlyStatsResponse = await backend.get(
          `/caseManagerMonthlyStats`
        );
        setMonthlyData(monthlyStatsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (refreshStatus){
      setRefreshStatus(false);
      getData();
    }
    
  }, [refreshStatus]);
  const handleFormSubmitSuccess = () => {
    setRefreshStatus(true);
  };
  return (
    <FormCM onFormSubmitSuccess={handleFormSubmitSuccess}/>
  );
};
