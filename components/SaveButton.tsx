import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Artwork } from "../hooks/useApiCollection";

export default function SaveButton({ id, art }: { id: string; art: Artwork }) {
  const { data } = useQuery({
    queryKey: ["like", id],
    initialData: false,
    queryFn: async () => {
      const item = await AsyncStorage.getItem(id);
      return item != null;
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (liked: boolean) => {
      if (liked) {
        return AsyncStorage.setItem(art.id.toString(), JSON.stringify(art));
      } else {
        return AsyncStorage.removeItem(id);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["like", id] }),
  });

  return (
    <MaterialIcons
      name={data ? "favorite" : "favorite-outline"}
      size={30}
      color={"#e11d48"}
      onPress={() => mutate(!data)}
      style={{
        textShadowColor: "gray",
        textShadowOffset: { height: 0, width: 0 },
        textShadowRadius: 4,
      }}
    />
  );
}
