import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { MonthlyStat } from "../../types/monthlyStat";
import FormCM from "./form";
import TableCM from "./table";

export const CaseManager = () => {
  const { backend } = useBackendContext();

  const [monthlyData, setMonthlyData] = useState<MonthlyStat[]>([]);

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

    getData();
  }, []);

  return (
    <div>
      <TableCM items={monthlyData} />
      <FormCM />
    </div>
  );
};
