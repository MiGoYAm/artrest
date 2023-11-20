import { useSegments } from "expo-router";

export default function useSegment() {
  return (useSegments() as ["(index)" | "(search)" | "(favourite)"])[0];
}
