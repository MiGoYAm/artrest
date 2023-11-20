import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect } from "expo-router";
import ArtworksList from "../../components/ArtworksList";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";
import { PAGE_SIZE } from "../../constants/Api";
import { Artwork } from "../../hooks/useApiCollection";

export default function FavouriteScreen() {
  const loadData = async (start: number): Promise<Artwork[]> => {
    const neededKeys = keys.data!.slice(start, start + PAGE_SIZE);

    const values = await AsyncStorage.multiGet(neededKeys);
    return values.map(([, v]) => {
      if (v) {
        return JSON.parse(v);
      }
    });
  };

  const keys = useQuery({
    queryKey: ["favouriteKeys"],
    queryFn: () => AsyncStorage.getAllKeys(),
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["favourites", keys],
    queryFn: ({ pageParam }) => loadData(pageParam),
    enabled: !!keys.data,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length === PAGE_SIZE) {
        return lastPageParam + PAGE_SIZE;
      }
    },
    select: (data) => data.pages.flat(),
  });

  useRefreshOnFocus(keys.refetch);

  return (
    <>
      <Stack.Screen options={{ title: "Favourite" }} listeners={{}} />
      <ArtworksList
        data={data}
        onEndReached={fetchNextPage}
        fetchNextPage={isFetchingNextPage}
      />
    </>
  );
}

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}
