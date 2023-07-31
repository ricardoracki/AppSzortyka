import { StyleSheet, View } from "react-native";

import { Contexts } from "./app/contexts";
import { Routes } from "./app/routes/Routes.app";

export default function App() {
  return (
    <Contexts>
      <View style={styles.container}>
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
