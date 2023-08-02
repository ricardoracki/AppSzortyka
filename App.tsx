import { StyleSheet, View } from "react-native";

import { Contexts } from "./app/contexts";
import { Routes } from "./app/routes/Routes.app";
import { StatusBar } from "expo-status-bar";
import { theme } from "./libraries/theme";
import * as NavigationBar from "expo-navigation-bar";

export default function App() {
  NavigationBar.setBackgroundColorAsync(theme.smart.colors.gray_600);

  return (
    <Contexts>
      <View style={styles.container}>
        <StatusBar translucent={true} style={"light"} />

        <Routes />
      </View>
    </Contexts>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
