import { ActivityIndicator } from "react-native";

export default function Loading({
  loading,
  children,
}: {
  loading?: boolean;
  children?: React.ReactNode;
}) {
  if (loading) {
    return <ActivityIndicator style={{ padding: 16 }} size="large" />;
  }
  return children;
}
