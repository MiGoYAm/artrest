import { useRouter } from "expo-router";
import { Text } from "./Themed";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { lastArtistAtom } from "./ArtContext";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import useSegment from "../hooks/useSegment";
import { useSetAtom } from "jotai";

export default function Table({
  artist,
  items,
  expandable,
  ...props
}: {
  artist?: { id: number; title: string };
  items?: Record<string, string | undefined>;
  expandable?: Record<string, string | undefined>;
} & ViewProps) {
  return (
    <View style={styles.column} {...props}>
      {artist ? <Artist {...artist} /> : undefined}
      {map(items, (k, v) => (
        <View style={[styles.element, styles.row]} key={k}>
          <Text style={styles.key}>{k}</Text>
          <Text style={styles.value}>{v}</Text>
        </View>
      ))}
      {map(expandable, (k, v) => (
        <Expand title={k} value={v} key={k} />
      ))}
    </View>
  );
}

const bullet = "\n\n● ";
export function bulletize(text: string | undefined) {
  if (text) {
    return "● " + text.replaceAll("\n\n", bullet);
  }
}

function Artist(artist: { id: number; title: string }) {
  const setArtist = useSetAtom(lastArtistAtom);
  const segment = useSegment();
  const router = useRouter();

  return (
    <Pressable style={[styles.element, styles.row]} key={"Artist"}>
      <Text style={styles.key}>Artist</Text>
      <Text
        style={[
          styles.value,
          {
            textDecorationLine: "underline",
          },
        ]}
        onPress={() => {
          setArtist(artist.title ?? "");
          router.push(`/${segment}/artist/${artist.id}`);
        }}
      >
        {artist.title ?? ""}
      </Text>
    </Pressable>
  );
}

function Expand({ title, value }: { title: string; value: string }) {
  const [expaned, setExpanded] = useState(false);

  return (
    <Pressable style={styles.element} onPress={() => setExpanded(!expaned)}>
      <View style={styles.row}>
        <Text>{title}</Text>
        <MaterialIcons
          name={expaned ? "expand-less" : "expand-more"}
          color="gray"
        />
      </View>
      {expaned ? <Text>{"\n" + value}</Text> : undefined}
    </Pressable>
  );
}

function map<V, R>(
  record: Record<string, V | undefined> | undefined,
  fn: (k: string, v: V) => R
) {
  if (!record) {
    return undefined;
  }

  return Object.entries(record).map(([k, v]) => {
    if (v) {
      return fn(k, v);
    }
  });
}

const styles = StyleSheet.create({
  column: {
    borderColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  element: {
    borderColor: "gray",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
  key: {
    flex: 1,
  },
  value: {
    flex: 3,
    textAlign: "right",
  },
});
