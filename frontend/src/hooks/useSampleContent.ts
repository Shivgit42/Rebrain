import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export type DemoContent = {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "document" | "link" | "tag";
  tags: { _id: string; title: string }[];
};

export const useSampleContent = () => {
  const [sample, setSample] = useState<DemoContent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`${BACKEND_URL}/api/v1/sample-content`)
      .then((res) => {
        if (!cancelled) setSample(res.data.content || []);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e?.response?.data?.message || "Failed to load sample content"
          );
          console.error("Failed to load sample content", e);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { sample, loading, error };
};
