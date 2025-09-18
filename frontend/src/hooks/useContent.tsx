import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export const useContent = () => {
  const [contents, setContents] = useState([]);

  const refresh = () => {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setContents(response.data.content);
      })

      .catch((e) => {
        console.error("Error fetching content:", e);
      });
  };

  useEffect(() => {
    refresh();

    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, []);

  return { contents, refresh };
};
