import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

export const CatchAll = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/landing-page");
  }, [navigate]);

  return <p>Route not found... redirecting...</p>;
};
