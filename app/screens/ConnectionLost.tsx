import { StyleSheet, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { theme } from "../../libraries/theme";
import { useAuth } from "../hooks/useAuth";

export function ConnectionLost() {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="wifi-off"
        size={120}
        color={theme.smart.colors.gray_300}
      />
      <Text style={styles.text}>Conexão indisponível!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.smart.colors.gray_600,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.smart.colors.gray_300,
    fontSize: theme.smart.fontSizes.xl,
    marginBottom: 30,
  },
});
