import { Stack } from "expo-router";
import { useState } from "react";
import ArtworksList from "../../components/ArtworksList";
import useApiCollection from "../../hooks/useApiCollection";
import { Text } from "../../components/Themed";
import { StyleSheet, View } from "react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const { data, fetchNextPage, isFetching, isFetched } = useApiCollection(
    `artworks/search?q=${query}`,
    ["search", query]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Search",
          headerTransparent: false,
          headerSearchBarOptions: {
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            hideWhenScrolling: false,
            autoFocus: true,
          },
        }}
      />
      {isFetched && data?.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.text}>No results</Text>
        </View>
      ) : (
        <ArtworksList
          data={data}
          onEndReached={fetchNextPage}
          fetchNextPage={isFetching}
          contentInsetAdjustmentBehavior="automatic"
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 40,
  },
});
