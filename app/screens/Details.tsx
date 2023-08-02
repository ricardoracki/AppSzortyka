import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  ImageSourcePropType,
  ToastAndroid,
  ScrollView,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

import { FontAwesome } from "@expo/vector-icons";

import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";

import { useNavigation, useRoute } from "@react-navigation/native";

import { ImageViewer } from "../components/ImageViewer";
import { Loading } from "../components/Loading";
import { RoundedButton } from "../components/RoundedButton";

import { useAuth } from "../hooks/useAuth";

import { theme } from "../../libraries/theme";

import {
  Machine,
  IMachine,
} from "../../services/firebaseApi/controllers/machine";
import { FIREBASE_STORAGE } from "../../services/firebaseApi";

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [machine, setMachine] = useState<IMachine>({} as IMachine);
  const [images, setImages] = useState<ImageSourcePropType[]>([]);

  const { params }: any = useRoute();
  const { navigate, addListener } = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    return addListener("focus", onLoad);
  }, []);

  async function onLoad() {
    const m = await Machine.getById(params.id);
    if (!m)
      return Alert.alert(
        "Erro",
        "Ocorreu um erro inesperado ao carregar esta máquina"
      );
    setMachine(m);
    await getImages(m.ns);
    setIsLoading(false);
  }

  async function getImages(ns: string) {
    const r = ref(FIREBASE_STORAGE, `/${ns}`);

    listAll(r).then(async ({ items }) => {
      const refs = items.map((i) => ref(FIREBASE_STORAGE, i.fullPath));

      Promise.all(
        refs.map(
          (r) =>
            new Promise(async (resolve) => {
              const data = {
                uri: await getDownloadURL(r),
                metadata: await getMetadata(r),
              };
              resolve(data);
            })
        )
      ).then((d) => {
        //@ts-ignore
        setImages(d);
      });
    });
  }

  async function onEdit() {
    navigate("new", { id: machine.id, ...machine });
  }

  async function onDelete() {
    const m = new Machine(machine);
    Alert.alert("Excluir", "Deseja excluir permanentemente?", [
      {
        text: "Excluir",
        onPress: async () => {
          await m.exclude();
          navigate("home");
        },
        style: "destructive",
      },
      { text: "Cancelar", onPress: () => {}, style: "default" },
    ]);
  }

  async function onShare() {
    /**
     * Copia texto padrao para o clipboard
     */
    let str = `*Número de Série:* ${machine.ns}\n`;

    str += `*Modelo:* ${machine.type}\n`;
    str += `*Cliente:* ${machine.customer}\n`;
    str += `*Descrição:*: ${machine.description}\n`;
    str += `*Criado em* ${machine.createdAt}\n`;
    str += `*Imagens:* \n`;

    //@ts-ignore
    images.forEach((i) => (str += `${i.uri}\n\n`));

    Clipboard.setString(str);
    ToastAndroid.show("Copiado para área de transferência!", ToastAndroid.LONG);
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {user && ["mod", "owner"].includes(user.role) && (
            <View style={styles.buttonsContainer}>
              <RoundedButton variant="info" onPress={onShare}>
                <FontAwesome
                  name="share-alt"
                  color={theme.smart.colors.white}
                  size={16}
                />
              </RoundedButton>

              <RoundedButton variant="warning" onPress={onEdit}>
                <FontAwesome
                  name="pencil"
                  color={theme.smart.colors.white}
                  size={16}
                />
              </RoundedButton>

              <RoundedButton variant="danger" onPress={onDelete}>
                <FontAwesome
                  name="trash"
                  color={theme.smart.colors.white}
                  size={16}
                />
              </RoundedButton>
            </View>
          )}
          <Text style={styles.textBig}>{machine.ns}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Modelo: </Text>
            <Text style={styles.text}>{machine.type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente: </Text>
            <Text style={styles.text}>{machine.customer}</Text>
          </View>
          <Text style={styles.label}>Descrição: </Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={[styles.text]}>{machine.description}</Text>
          </ScrollView>

          <FlatList
            style={styles.list}
            data={images}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(e) => `${Math.random()}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={{ alignSelf: "center", color: theme.colors.text }}>
                {isLoadingImages
                  ? "Carregando imagens"
                  : "Sem imagens para mostrar"}
              </Text>
            )}
            renderItem={(element) => (
              <ImageViewer
                source={element.item}
                onPress={() => {
                  navigate("imageViewer", {
                    source: element.item,
                  });
                }}
              />
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.label}>
              {machine.edited
                ? `Editado por ${machine.editedBy} em ${new Date(
                    machine.editedAt || 0
                  ).toLocaleDateString("pt-br")}`
                : `Criado por ${machine.createdBy} em ${new Date(
                    machine.createdAt || 0
                  ).toLocaleDateString("pt-br")}`}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.smart.colors.gray_600,
    padding: 12,
  },

  label: {
    color: theme.smart.colors.gray_300,
    fontSize: theme.smart.fontSizes.lg,
  },
  text: {
    color: theme.smart.colors.gray_200,
    fontSize: theme.smart.fontSizes.xl,
  },
  textBig: {
    color: theme.smart.colors.gray_200,
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 30,
  },
  descriptionContainer: {
    flex: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  list: {},
  listContainer: {
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  footer: {
    alignItems: "flex-end",
  },
  buttonsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 900,
    justifyContent: "space-between",
    paddingRight: 12,
  },
});
