import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Text } from "../../components/Themed";
import Image from "../../components/Image";
import { ArtContext } from "../../components/ArtContext";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import Table, { bulletize } from "../../components/Table";
import SaveButton from "../../components/SaveButton";
import HTMLView from "../../components/HTMLView";
import { Artwork } from "../../hooks/useApiCollection";
import LoadingView from "../../components/Loading";
import useSegment from "../../hooks/useSegment";
import useApiQuery from "../../hooks/useApiQuery";

export default function ArtScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isFetching } = useApiQuery(
    `artworks/${id}`,
    ["art", id],
    useContext(ArtContext).art
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.title ?? "",
          headerBackTitleVisible: false,
          headerRight: () =>
            data ? <SaveButton id={id} art={data} /> : undefined,
          /* 
          headerStyle: {
            backgroundColor: data.color
              ? `hsl(${data.color.h} ${data.color.s}% ${data.color.l}%)`
              : undefined,
          },
          */
        }}
      />
      <ScrollView>
        {data ? <HeaderImage art={data} /> : undefined}
        <LoadingView loading={isFetching}>
          <View style={contentStyles.content}>
            <Text>{data.date_display}</Text>
            <Text>{data.artist_display}</Text>
            <HTMLView value={data.description} />

            <View style={{ gap: 4 }}>
              <Text>On view:</Text>
              <HTMLView value={data.on_loan_display} />
            </View>

            <Table
              artist={{ title: data.artist_title, id: data.artist_id }}
              items={{
                Place: data.place_of_origin,
                Type: data.artwork_type_title,
                Styles: data.style_titles?.join(", "),
                Medium: data.medium_display,
                Inscriptions: data.inscriptions,
                Dimensions: data.dimensions,
                "Other titles": data.alt_titles?.join(", "),
                "Credit Line": data.credit_line,
                "Reference Number": data.main_reference_number,
                Copyright: data.copyright_notice,
              }}
              expandable={{
                "Publication history": bulletize(data.publication_history),
                "Exhibition history": bulletize(data.exhibition_history),
                Provenance: data.provenance_text,
              }}
            />
          </View>
        </LoadingView>
      </ScrollView>
    </>
  );
}

function HeaderImage({ art }: { art: Artwork }) {
  const dimensions = useWindowDimensions();
  const segment = useSegment();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        if (art.is_zoomable) {
          router.push(`/${segment}/image/${art.id}`);
        }
      }}
    >
      <Image
        item={art}
        priority="high"
        style={{ maxHeight: dimensions.height * 0.65, alignSelf: "center" }}
      />
    </Pressable>
  );
}

export const contentStyles = StyleSheet.create({
  content: {
    padding: 14,
    gap: 16,
  },
});
