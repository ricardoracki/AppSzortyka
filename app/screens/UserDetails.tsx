import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { Loading } from "../components/Loading";

import { theme as staticTheme } from "../../libraries/theme";
import { CheckBox } from "../components/CheckBox";
import { useTheme } from "../hooks/useTheme";
import { FIREBASE_DB, userCollection } from "../../services/firebaseApi";

export function UserDetails({ route, navigation }: any) {
  const [isLoading, setIsLoading] = useState(true); // Mostra ícon de carregamento enquanto busca dados no firebase
  const [user, setUser] = useState<Auth.IUser>({} as Auth.IUser); // Usuário que está sendo exibido
  const [isActive, setIsActive] = useState(false); // Status de ativo do usuário
  const [role, setRole] = useState(""); // Status de cargo do usuario
  const [editMode, setEditMode] = useState(false); // Controla se está em modo de edição do usuário

  const { theme } = useTheme();

  function showToast() {
    ToastAndroid.show("Usuário atualizado com sucesso!", ToastAndroid.SHORT);
  }

  async function getUser(id: string) {
    const q = doc(userCollection, id);
    // Busca dados do usuário através do ID passado por parâmetro
    const querySnapshot = await getDoc(q);
    const data = { id: querySnapshot.id, ...querySnapshot.data() };
    if (!data) return Alert.alert("Usuário nao encontrado");

    setUser(data as Auth.IUser);
    // @ts-ignore
    setIsActive(data.active);
    // @ts-ignore
    setRole(data.role);
    setIsLoading(false);
  }

  useEffect(() => {
    getUser(route.params.id);
  }, []);

  async function onEditMode() {
    if (!editMode) return setEditMode(true);
    if (role != user.role || isActive != user.active) {
      try {
        await updateDoc(doc(userCollection, user.id), {
          ...user,
          active: isActive,
          role,
        });
        showToast();
        getUser(user.id);
      } catch (e) {
        Alert.alert("Erro inesperado", `${e}`);
      }
    }
    return setEditMode(false);
  }

  function onDelete() {
    Alert.alert("Excluir", "Deseja excluir permanentemente?", [
      { text: "Excluir", onPress: remove, style: "destructive" },
      { text: "Cancelar", onPress: () => {}, style: "default" },
    ]);
    async function remove() {
      try {
        await deleteDoc(doc(FIREBASE_DB, "user", route.params.id));
        navigation.navigate("users");
      } catch (e) {
        Alert.alert("Erro inesperado", `${e}`);
      }
    }
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <View style={styles.content}>
          {user.name != "admin" && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.editButton,
                  editMode && styles.saveButton,
                ]}
                onPress={onEditMode}
              >
                <FontAwesome
                  name={editMode ? "save" : "pencil"}
                  color={"white"}
                  size={16}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, ...styles.deleteButton }}
                onPress={onDelete}
              >
                <FontAwesome name="trash" color={"white"} size={16} />
              </TouchableOpacity>
            </View>
          )}
          <Text style={{ ...styles.textBig, color: theme.colors.text }}>
            {user.name}
          </Text>

          <View style={styles.row}>
            <Text style={{ ...styles.label, color: theme.colors.text + "8" }}>
              Ativo
            </Text>
            <CheckBox
              checked={isActive}
              onPress={() => setIsActive((v) => !v)}
              disabled={!editMode}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={{ ...styles.label, color: theme.colors.text + "8" }}>
                Owner
              </Text>
              <CheckBox
                checked={role == "owner"}
                onPress={() => setRole("owner")}
                disabled={!editMode}
              />
            </View>

            <View style={styles.row}>
              <Text style={{ ...styles.label, color: theme.colors.text + "8" }}>
                Mod
              </Text>
              <CheckBox
                checked={role == "mod"}
                onPress={() => setRole("mod")}
                disabled={!editMode}
              />
            </View>

            <View style={styles.row}>
              <Text style={{ ...styles.label, color: theme.colors.text + "8" }}>
                Guest
              </Text>
              <CheckBox
                checked={role == "guest"}
                onPress={() => setRole("guest")}
                disabled={!editMode}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: staticTheme.smart.colors.gray_600,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 900,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  saveButton: {
    backgroundColor: staticTheme.colors.success,
  },
  editButton: {
    backgroundColor: staticTheme.colors.warning,
  },
  deleteButton: {
    backgroundColor: staticTheme.colors.danger,
  },

  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginRight: 20,
  },
  end: {
    alignItems: "flex-end",
  },
  label: {
    marginRight: 10,
  },
  textBig: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 30,
  },
  textSmall: {
    fontSize: 19,
  },
});
