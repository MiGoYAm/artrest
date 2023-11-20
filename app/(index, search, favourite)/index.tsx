import { Stack } from "expo-router";
import React from "react";
import ArtworksList from "../../components/ArtworksList";
import useApiCollection from "../../hooks/useApiCollection";

export default function ExploreScreen() {
  const { data, fetchNextPage, isFetching } = useApiCollection("artworks", [
    "explore",
  ]);

  return (
    <>
      <Stack.Screen options={{ title: "Explore" }} />
      <ArtworksList
        data={data}
        onEndReached={fetchNextPage}
        fetchNextPage={isFetching}
      />
    </>
  );
}
