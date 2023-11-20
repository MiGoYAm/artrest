import { Stack } from "expo-router";
import { ArtContext } from "../../components/ArtContext";
import { useRef, useState } from "react";
import { Artwork } from "../../hooks/useApiCollection";

export default function Layout() {
  const [art, setArt] = useState<Artwork | null>(null);
  const [artist, setArtist] = useState("");
  const imageUrlRef = useRef("https://www.artic.edu/iiif/2");

  return (
    <ArtContext.Provider
      value={{ art, setArt, artist, setArtist, imageUrlRef }}
    >
      <Stack />
    </ArtContext.Provider>
  );
}
