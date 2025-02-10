import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { MonthlyStat } from "../../types/monthlyStat";
import FormCM from "./form";
import TableCM from "./table";

export const CaseManager = () => {
  const { backend } = useBackendContext();
  const [refreshStatus, setRefreshStatus] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const monthlyStatsResponse = await backend.get(
          `/caseManagerMonthlyStats`
        );
        console.log(monthlyStatsResponse.data);
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
    <div>
      <TableCM items={monthlyData} />
      <FormCM onFormSubmitSuccess={handleFormSubmitSuccess}/>
    </div>
  );
};
