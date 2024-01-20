import { Stack } from "expo-router";
import React from "react";
import ArtworksList from "../../components/ArtworksList";
import useApiCollection from "../../hooks/useApiCollection";

export default function ExploreScreen() {
  const { data, refetch, fetchNextPage, isFetching, isRefetching } =
    useApiCollection("artworks", ["explore"]);

  return (
    <>
      <Stack.Screen options={{ title: "Explore" }} />
      <ArtworksList
        data={data}
        onEndReached={fetchNextPage}
        fetchNextPage={isFetching}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </>
  );
}
