import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import FormFrontDesk from "./form";

interface MonthlyStats {
  date: string;
  id: number;
  totalOfficeVisits: number;
  totalCalls: number;
  totalUnduplicatedCalles: number;
  totalVisitsToPantryAndDonationsRoom: number;
  totalNumberOfPeopleServedInPantry: number;
  totalVisitsToPlacentiaPantry: number;
  totalNumberOfPeopleServedInPlacentiaPantry: number;
}

export const FrontDeskMonthlyStats = () => {
  const { backend } = useBackendContext();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshStatus, setRefreshStatus] = useState(true);

  const fetchFrontDesk = async () => {
    try {
      const response = await backend.get("/frontDesk");
      setMonthlyStats(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFrontDesk()]);
      setLoading(false);
    };
    if (refreshStatus) {
      fetchData();
      setRefreshStatus(false);
    }
    
  }, [refreshStatus]);

  const handleFormSubmitSuccess = () => {
    setRefreshStatus(true);
  };
  return ( 
    <div>
      <FormFrontDesk onFormSubmitSuccess={handleFormSubmitSuccess} />
    </div>
  );
};