import { useInfiniteQuery } from "@tanstack/react-query";
import { API_URL, PAGINATION_PARAMS } from "../constants/Api";
import { useSetAtom } from "jotai";
import { imageUrlAtom } from "../components/ArtContext";

export type Dimensions = {
  height_cm: number | null;
  width_cm: number | null;
};

export type Artwork = {
  id: number;
  title: string;
  thumbnail: {
    height: number | null;
    width: number | null;
    alt_text: string | null;
    lqip: string | null;
  };
  image_id: string | null;
  is_zoomable?: boolean | null;
  dimensions_detail: Dimensions[];
};

export type Query<T> = {
  pagination: {
    current_page: number;
    total_pages: number;
  };
  data: T;
  config: {
    iiif_url: string;
  };
};

export default function useApiCollection(path: string, queryKey: string[]) {
  const char = path.includes("?") ? "&" : "?";

  const setImageUrl = useSetAtom(imageUrlAtom)
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }: any): Promise<Query<Artwork[]>> => {
      const response = await fetch(
        `${API_URL}${path}${char}page=${pageParam}${PAGINATION_PARAMS}`
      );
      const data = await response.json();

      if (data.config.iiif_url) {
        setImageUrl(data.config.iiif_url)
      }
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) => {
      if (pagination.current_page < pagination.total_pages) {
        return pagination.current_page + 1;
      }
    },
    select: (data) => data.pages.flatMap((page) => page.data),
  });
}
