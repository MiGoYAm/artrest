import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants/Api";
import { useSetAtom } from "jotai";
import { imageUrlAtom } from "../components/ArtContext";

export default function useApiQuery(
  url: string,
  queryKey: string[],
  placeholderData?: any
) {
  const setImageUrl = useSetAtom(imageUrlAtom)

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${API_URL}${url}`);
      const data = await response.json();

      if (data.config.iiif_url) {
        setImageUrl(data.config.iiif_url)
      }
      return data.data;
    },
    placeholderData,
  });
}
