import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { Tabs } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { Provider } from "jotai";
import { enableScreens } from "react-native-screens";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(index)",
};

const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...MaterialIcons.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
              tabBarLabelStyle: { fontSize: 12 },
            }}
          >
            <Tabs.Screen
              name="(index)"
              options={{
                title: "Explore",
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="explore" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="(search)"
              options={{
                title: "Search",
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="search" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="(favourite)"
              options={{
                title: "Favourite",
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="favorite" color={color} />
                ),
              }}
            />
          </Tabs>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}
