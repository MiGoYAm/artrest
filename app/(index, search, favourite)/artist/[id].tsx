import { Stack, useLocalSearchParams } from "expo-router";
import HTMLView from "../../../components/HTMLView";
import { contentStyles } from "../[id]";
import Table from "../../../components/Table";
import ArtworksList from "../../../components/ArtworksList";
import useApiCollection from "../../../hooks/useApiCollection";
import { ArtContext } from "../../../components/ArtContext";
import { useContext } from "react";
import LoadingView from "../../../components/Loading";
import useApiQuery from "../../../hooks/useApiQuery";

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data, isFetching } = useApiQuery(
    `agents/${id}?fields=title,alt_titles,birth_date,death_date,description`,
    ["artist", id],
    { title: useContext(ArtContext).artist }
  );

  const arts = useApiCollection(
    `artworks/search?query[term][artist_id]=${id}`,
    ["artist_artworks", id]
  );

  return (
    <>
      <Stack.Screen
        options={{ headerBackTitleVisible: false, title: data.title }}
      />
      <LoadingView loading={isFetching}>
        <ArtworksList
          ListHeaderComponentStyle={contentStyles.content}
          ListHeaderComponent={() => (
            <>
              <Table
                items={{
                  "Also known as": data.alt_titles?.join(", "),
                  Born: data.birth_date?.toString(),
                  Died: data.death_date?.toString(),
                }}
              />
              <HTMLView value={data?.description} />
            </>
          )}
          data={arts.data}
          onEndReached={arts.fetchNextPage}
          fetchNextPage={arts.isFetching}
        />
      </LoadingView>
    </>
  );
}
