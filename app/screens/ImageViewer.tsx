import { useState } from "react";
import { View, StyleSheet, Image, ToastAndroid, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";

import { Loading } from "../components/Loading";
import { RoundedButton } from "../components/RoundedButton";
import { deleteObject, ref } from "firebase/storage";
import { useAuth } from "../hooks/useAuth";
import { FIREBASE_STORAGE } from "../../services/firebaseApi";

export function ImageViewer({ route, navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const { source } = route.params;
  const { user } = useAuth();

  function onShare() {
    Clipboard.setString(
      `Imagem de ${source.metadata.fullPath.split("/")[0]}:\n${source.uri}`
    );
    ToastAndroid.show("Copiado!", ToastAndroid.SHORT);
  }

  function onDelete() {
    /**
     * abre um alert com mensagem de confirmação e depois remove o elemento do storage
     */
    Alert.alert("Excluir", "Deseja excluir permanentemente?", [
      { text: "Excluir", onPress: remove, style: "destructive" },
      { text: "Cancelar", onPress: () => {}, style: "default" },
    ]);

    async function remove() {
      const fileRef = ref(FIREBASE_STORAGE, source.metadata.fullPath);
      await deleteObject(fileRef);
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loading />}
      {user && ["mod", "owner"].includes(user.role) && (
        <View style={styles.buttonContainer}>
          <RoundedButton onPress={onShare} variant="info">
            <FontAwesome name="share-alt" color={"white"} size={16} />
          </RoundedButton>

          <RoundedButton onPress={onDelete} variant="danger">
            <FontAwesome name="trash" color={"white"} size={16} />
          </RoundedButton>
        </View>
      )}

      <Image
        style={styles.image}
        source={source}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    widht: 16,
    zIndex: 1,
    flexDirection: "row",
  },
  image: {
    flex: 1,
  },
});
