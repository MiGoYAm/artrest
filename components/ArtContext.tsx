import { createContext } from "react";
import { Artwork } from "../hooks/useApiCollection";

type ArtValue = {
  art: Artwork | null;
  setArt: React.Dispatch<React.SetStateAction<Artwork | null>>;
  artist: string;
  setArtist: React.Dispatch<React.SetStateAction<string>>;
  imageUrlRef: React.MutableRefObject<string>;
};

export const ArtContext = createContext({} as ArtValue);
