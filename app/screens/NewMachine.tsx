import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";

import { theme } from "../../libraries/theme";
import { SmartInputBlock } from "../components/SmartInputBlock";
import { SmartButton } from "../components/SmartButton";
import { Machine } from "../../services/firebaseApi/controllers/machine";
import { useAuth } from "../hooks/useAuth";
import { ref, uploadBytes } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../services/firebaseApi";

export function NewMachine() {
  const { params }: any = useRoute();
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const typeInputRef = useRef<any>(null);

  const [images, setImages] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [id, setId] = useState<string>(params?.id || "");
  const [ns, setNs] = useState(params?.ns || "");
  const [customer, setCustomer] = useState(params?.customer || "");
  const [type, setType] = useState(params?.type || "");
  const [description, setDescription] = useState(params?.description || "");

  const [nsError, setNsError] = useState(false);

  const pickImage = async () => {
    // Abre o coletor de imagens
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    //@ts-ignore
    if (!result.canceled) setImages(result.assets);
  };

  async function onSubmit() {
    // Valida e salva os dados no firestore
    setNsError(false);
    if (!ns || !type || !customer)
      return ToastAndroid.show("Preencha todos os campos", ToastAndroid.SHORT);

    try {
      setIsloading(true);
      const check = await Machine.nsExists(ns);
      if (check && !id) {
        setNsError(true);
        return ToastAndroid.show(
          "Número de série já cadastrado",
          ToastAndroid.SHORT
        );
      }

      const m = new Machine({
        id,
        ns,
        type,
        customer,
        description,
        createdBy: user ? user.name : "",
      });

      if (id) {
        m.createdAt = params.createdAt;
        m.edited = true;
        m.editedBy = user ? user.name : "";
      }

      await m.save();
      if (images.length > 0) await uploadFiles();

      Alert.alert(
        "Sucesso!",
        id
          ? "Máquina atualizada com sucesso!"
          : "Máquina cadastrada com sucesso!",
        [
          {
            text: "Ok",
            onPress: () => {
              navigate("home");
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert("Erro", "Ocorreu um erro inesperado!");
      console.log(e);
    } finally {
      setIsloading(false);
    }
  }

  const getBlobFroUri = async (uris: string): Promise<Blob> => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(console.log(e));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uris, true);
      xhr.send(null);
    });
    //@ts-ignore
    return blob;
  };

  async function uploadFiles() {
    const metadata = { contentType: "image/jpg" };
    let i = 0;

    images.forEach(async (i) => {
      const storageRef = ref(FIREBASE_STORAGE, `${ns}/${Math.random()}.jpg`);
      //@ts-ignore
      const blob: Blob = await getBlobFroUri(i.uri);

      await uploadBytes(storageRef, blob, metadata);
    });
  }

  async function autoNs() {
    try {
      const nextNs = await Machine.getNextNs();
      setNs(nextNs);
      ToastAndroid.show(
        "Número de Série gerado automaticamente",
        ToastAndroid.SHORT
      );
    } catch (e) {
      ToastAndroid.show(
        "Erro ao gerar o NS automaticamente",
        ToastAndroid.SHORT
      );
    }
  }

  return (
    <View style={styles.container}>
      <SmartInputBlock
        placeholder="Número de Série"
        placeholderTextColor={theme.smart.colors.gray_300}
        onChangeText={setNs}
        value={ns}
        editable={!id}
        errorMessage={nsError ? "Número de série já cadastrado" : ""}
        endOfLineComponent={
          <TouchableOpacity onPress={autoNs}>
            <MaterialIcons
              name="navigate-next"
              size={28}
              color={theme.smart.colors.gray_300}
            />
          </TouchableOpacity>
        }
      />
      <SmartInputBlock
        placeholder="Modelo"
        placeholderTextColor={theme.smart.colors.gray_300}
        onChangeText={setType}
        value={type}
      />
      <SmartInputBlock
        placeholder="Cliente"
        placeholderTextColor={theme.smart.colors.gray_300}
        onChangeText={setCustomer}
        value={customer}
      />
      <SmartInputBlock
        placeholder="Descrição (Opcional)"
        placeholderTextColor={theme.smart.colors.gray_300}
        onChangeText={setDescription}
        multiline={true}
        value={description}
      />
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity onPress={pickImage} disabled={isLoading}>
          <AntDesign name="addfile" size={30} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={{ ...styles.text, color: theme.colors.text }}>
          {" "}
          {images.length} Imagens selecionadas
        </Text>
      </View>
      <SmartButton label="Salvar" onPress={onSubmit} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.smart.colors.gray_600,
    alignItems: "center",
    paddingTop: 16,
    overflow: "scroll",
  },
  imagePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    marginLeft: 50,
  },
  text: {},
});
