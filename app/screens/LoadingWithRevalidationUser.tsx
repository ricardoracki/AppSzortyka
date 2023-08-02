import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "../../libraries/theme";

export function LoadingWithRevalidationUser() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.smart.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.smart.colors.gray_600,
  },
});
