import { Stack, useLocalSearchParams } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { imageUrlAtom } from "../../../components/ArtContext";

const AnimatedImage = Animated.createAnimatedComponent(Image);

function clamp(value: number, scale: number, length: number) {
  "worklet";
  return Math.min(
    Math.max(value, (-length + length / scale) / 2),
    (length - length / scale) / 2
  );
}

export default function ImageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const imageUrl = useAtomValue(imageUrlAtom)
  const { width, height } = useWindowDimensions();

  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: clamp(offset.value.x, scale.value, width) },
        { translateY: clamp(offset.value.y, scale.value, height) },
      ],
    };
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart((event) => {
      if (scale.value === 1) {
        scale.value = withTiming(5);
        offset.value = withTiming({
          x: -event.absoluteX + width / 2,
          y: -event.absoluteY + height / 2,
        });
        start.value = offset.value;
      } else {
        scale.value = withTiming(1);
        offset.value = withTiming({ x: 0, y: 0 });
        start.value = offset.value;
      }
    });

  const drag = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((event) => {
      offset.value = {
        x: clamp(
          event.translationX / scale.value + start.value.x,
          scale.value,
          width
        ),
        y: clamp(
          event.translationY / scale.value + start.value.y,
          scale.value,
          height
        ),
      };
    })
    .onEnd(() => {
      start.value = offset.value;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(savedScale.value * event.scale, 1);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const gesture = Gesture.Race(doubleTap, Gesture.Simultaneous(drag, pinch));

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          animation: "fade",
          gestureEnabled: false,
          headerBackTitle: "Back",
        }}
      />
      <GestureDetector gesture={gesture}>
        <AnimatedImage
          style={[StyleSheet.absoluteFill, imageStyle]}
          contentFit="contain"
          transition={150}
          source={{
            uri: `${imageUrl}/${id}/full/843,/0/default.jpg`,
            cacheKey: id,
          }}
        />
      </GestureDetector>
    </>
  );
}
