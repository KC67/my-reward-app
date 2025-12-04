import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "../utils/logger";
export default function useFetchData(url) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          Logger.error(`HTTP ${res.status} - Failed to fetch: ${url}`);
          navigate("/404", { replace: true });
          return;
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        Logger.error(`HTTP error: ${err}`);
        navigate("/404", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, navigate]);

  return { data, loading };
}
