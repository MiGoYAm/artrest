import { Artwork } from "../hooks/useApiCollection";
import { atom } from "jotai";

export const imageUrlAtom = atom("https://www.artic.edu/iiif/2");
export const lastArtAtom = atom<Artwork | null>(null);
export const lastArtistAtom = atom<String>("");
