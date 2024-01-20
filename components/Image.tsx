import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Image as ExpoImage } from "expo-image";
import { StyleSheet, View, Text, ColorValue, Platform } from "react-native";
import { Artwork } from "../hooks/useApiCollection";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { imageUrlAtom } from "./ArtContext";

type ItemProps = {
  item: Artwork;
};

export type ImageProps = ItemProps &
  Omit<ExpoImage["props"], "source" | "alt" | "onError">;

export default function Image({ item, style, ...rest }: ImageProps) {
  const [errored, setErrored] = useState(false);
  const imageUrl = useAtomValue(imageUrlAtom);

  if (!item.image_id) {
    return <Container icon="no-photography" message="No image" color="gray" />;
  } else if (errored) {
    return (
      <Container icon="error" message="Failed to load the image" color="red" />
    );
  }

  const aspectRatio = getAspectRatio(item);
  const width = Math.min(843, item.thumbnail.width ?? Infinity); // Requests for scales in excess of 100% are not allowed.

  return (
    <ExpoImage
      style={[{ width: "100%", aspectRatio }, style]}
      alt={item.thumbnail.alt_text ?? undefined}
      contentFit="contain"
      transition={150}
      placeholder={Platform.select({
        ios: undefined,
        default: item.thumbnail.lqip,
      })} // bug on ios
      source={{
        uri: `${imageUrl}/${item.image_id}/full/${width},/0/default.jpg`,
        cacheKey: item.image_id,
      }}
      onError={({ error }) => {
        switch (error) {
          case "Operation cancelled by user during querying the cache":
          case "Operation cancelled by user during sending the request":
            break;
          default:
            setErrored(true);
        }
      }}
      {...rest}
    />
  );
}

function Container({
  icon,
  message,
  color,
}: {
  icon: string;
  message: string;
  color: ColorValue;
}) {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <MaterialIcons name={icon as any} size={28} color={"white"} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: "white",
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 2,
  },
});

function getAspectRatio(item: Artwork): number {
  let ratio = 1;
  if (item.thumbnail.width && item.thumbnail.height) {
    ratio = item.thumbnail?.width / item.thumbnail?.height;
  } else if (item.dimensions_detail[0]) {
    const { width_cm, height_cm } = item.dimensions_detail[0];
    if (width_cm && height_cm) {
      ratio = width_cm / height_cm;
    }
  }

  return ratio;
}
