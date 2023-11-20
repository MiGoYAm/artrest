import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants/Api";
import { useContext } from "react";
import { ArtContext } from "../components/ArtContext";

export default function useApiQuery(
  url: string,
  queryKey: string[],
  placeholderData?: any
) {
  const { imageUrlRef } = useContext(ArtContext);

  const queryFn = async () => {
    const response = await fetch(`${API_URL}${url}`);
    const data = await response.json();

    if (data.config.iiif_url) {
      imageUrlRef.current = data.config.iiif_url;
    }
    return data.data;
  };

  return useQuery({
    queryKey,
    queryFn,
    placeholderData,
  });
}
