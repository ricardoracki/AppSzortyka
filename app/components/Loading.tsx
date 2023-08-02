import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

export function Loading() {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.3,
  },
});
