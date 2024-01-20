import { MasonryFlashList, MasonryFlashListProps } from "@shopify/flash-list";
import { useRef } from "react";
import { Text } from "./Themed";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Image from "./Image";
import { lastArtAtom } from "./ArtContext";
import React from "react";
import { useScrollToTop } from "@react-navigation/native";
import { Artwork } from "../hooks/useApiCollection";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Loading from "./Loading";
import useSegment from "../hooks/useSegment";
import { useSetAtom } from "jotai";

export type ArtworksListProps = {
  fetchNextPage?: boolean;
} & Omit<
  MasonryFlashListProps<Artwork>,
  "renderItem" | "estimatedItemSize" | "numColumns" | "ListFooterComponent"
>;

export default function ArtworksList({
  fetchNextPage,
  ...rest
}: ArtworksListProps) {
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  return (
    <MasonryFlashList
      renderItem={({ item }) => <Element item={item} />}
      estimatedItemSize={150}
      numColumns={2}
      ListFooterComponent={() => <Loading loading={fetchNextPage} />}
      onEndReachedThreshold={2}
      contentInsetAdjustmentBehavior="automatic"
      ref={scrollRef}
      {...rest}
    />
  );
}

function Element({ item }: { item: Artwork }) {
  const setArt = useSetAtom(lastArtAtom);
  const segment = useSegment();
  const router = useRouter();

  const opacity = useSharedValue(0);

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => {
      setArt(item);
      router.push(`/${segment}/${item.id}`);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onStart(() => {
      opacity.value = withSequence(
        withTiming(1, {
          duration: 100,
          easing: Easing.poly(2),
        }),
        withTiming(0, {
          duration: 250,
          easing: Easing.poly(2),
        })
      );
      AsyncStorage.setItem(item.id.toString(), JSON.stringify(item));
    });

  const composed = Gesture.Exclusive(doubleTap, tap);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.element}>
        <View>
          <Image item={item} recyclingKey={item.image_id} />
          <Animated.View
            style={[styles.overlay, animatedStyles, StyleSheet.absoluteFill]}
          />
        </View>
        <Text numberOfLines={3} style={styles.title}>
          {item.title}
        </Text>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  element: {
    marginHorizontal: StyleSheet.hairlineWidth / 2,
  },
  title: {
    fontSize: 14,
    paddingTop: 4,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  overlay: {
    backgroundColor: "#e11d48",
  },
});
