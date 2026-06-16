import { useEffect, useState } from "react";

const cloneData = (value) => JSON.parse(JSON.stringify(value));

function useAccountResource(loader, fallbackValue, deps = []) {
  const [data, setData] = useState(() => cloneData(fallbackValue));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await loader();
        if (!active) return;
        setData(response && (Array.isArray(response) ? response.length >= 0 : true) ? response : cloneData(fallbackValue));
      } catch {
        if (!active) return;
        setData(cloneData(fallbackValue));
        setError("Showing demo data until your account syncs.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, deps);

  return { data, setData, loading, error, setError };
}

export default useAccountResource;
