import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { theme } from "../../libraries/theme";
import { useAuth } from "../hooks/useAuth";

import { SmartInputBlock } from "../components/SmartInputBlock";
import { SmartButton } from "../components/SmartButton";
import { FloatingButton } from "../components/FloatingButton";
import { HomeListItem } from "../components/HomeListItem";
import { machineCollection } from "../../services/firebaseApi";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";
import { BoxItem, Divider, FloatingBox } from "../components/FloatingBox";
import packageJson from "../../app.json";
import { Loading } from "../components/Loading";

export function NewHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [machines, setMachines] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [filterByNs, setFilterByNs] = useState("");
  const [filterByType, setFilterByType] = useState("");
  const [filterByCustomer, setFilterByCustomer] = useState("");

  const { user, logout } = useAuth();
  const { navigate, addListener } = useNavigation();

  useEffect(() => {
    const subscriber = loadMachines();
    const subscriberNavigation = addListener("blur", () => {
      setShowMenu(false);
      setShowFilters(false);
    });

    return () => {
      subscriberNavigation();
      subscriber();
    };
  }, []);

  function loadMachines(filters?: any) {
    const q = filters
      ? query(machineCollection, ...filters)
      : query(machineCollection, orderBy("createdAt", "desc"));
    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        const data: any[] = [];
        snapshot.docs.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setMachines(data);
        setIsLoading(false);
      },
    });

    return subscriber;
  }

  async function onFilter() {
    const wheres = [];
    if (filterByNs) wheres.push(where("ns", "==", filterByNs.toUpperCase()));
    else {
      if (filterByCustomer)
        wheres.push(where("customer", "==", filterByCustomer.toUpperCase()));
      if (filterByType)
        wheres.push(where("type", "==", filterByType.toUpperCase()));
    }

    loadMachines(wheres);
    setShowFilters(false);
  }

  function onAbout() {
    setShowMenu(false);
    Alert.alert(
      `${packageJson.expo.name}`,
      `Versão  ${packageJson.expo.version}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.row}>
          <Text style={styles.headerText}>Olá </Text>
          <Text style={styles.headerTextUserName}>{user?.name}</Text>
        </View>

        <View style={styles.headerButtonsContainer}>
          {filterByCustomer != "" || filterByType != "" || filterByNs != "" ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setShowFilters(false);
                setFilterByCustomer("");
                setFilterByNs("");
                setFilterByType("");
                loadMachines();
              }}
            >
              <MaterialIcons
                name="search-off"
                size={theme.smart.fontSizes.xxl}
                color={
                  filterByCustomer != "" ||
                  filterByType != "" ||
                  filterByNs != ""
                    ? theme.colors.danger
                    : theme.smart.colors.gray_200
                }
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilters((v) => !v)}
          >
            <MaterialIcons
              name="search"
              size={theme.smart.fontSizes.xxl}
              color={theme.smart.colors.gray_200}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowMenu(true)}
          >
            <Entypo
              name="dots-three-vertical"
              size={theme.smart.fontSizes.xxl}
              color={theme.smart.colors.gray_200}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FloatingBox
        show={showMenu}
        onClose={() => {
          setShowMenu(false);
        }}
        position={{ top: 130, right: 20 }}
      >
        {user && user.role == "owner" && (
          <BoxItem
            label="Gerenciar usuários"
            onPress={() => {
              navigate("users");
            }}
          >
            <MaterialIcons
              name="admin-panel-settings"
              size={19}
              color="white"
            />
          </BoxItem>
        )}
        <BoxItem label="Sobre" onPress={onAbout}>
          <FontAwesome
            size={19}
            name="info"
            color={theme.smart.colors.gray_200}
          />
        </BoxItem>
        <Divider />
        <BoxItem label="Logout" onPress={logout}>
          <FontAwesome
            size={19}
            name="sign-out"
            color={theme.smart.colors.gray_200}
          />
        </BoxItem>
      </FloatingBox>

      {showFilters && (
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.contentHeaderText}>Filtrar Máquinas</Text>
          </View>
          <SmartInputBlock
            placeholder="Buscar Número de Série"
            placeholderTextColor={theme.smart.colors.gray_300}
            onChangeText={setFilterByNs}
          />
          <SmartInputBlock
            placeholder="Buscar por Tipo"
            placeholderTextColor={theme.smart.colors.gray_300}
            onChangeText={setFilterByType}
          />
          <SmartInputBlock
            placeholder="Buscar por Cliente"
            placeholderTextColor={theme.smart.colors.gray_300}
            onChangeText={setFilterByCustomer}
          />
          <SmartButton
            label="Filtrar"
            bgColor={theme.smart.colors.primary}
            onPress={onFilter}
          />
        </View>
      )}

      <View style={styles.content}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {user && ["owner", "mod"].includes(user?.role) && (
              <FloatingButton onPress={() => navigate("new")} />
            )}

            <View style={styles.contentHeader}>
              <Text style={styles.contentHeaderText}>Máquinas</Text>
              <Text style={styles.contentHeaderNumber}>{machines.length}</Text>
            </View>
            <FlatList
              style={styles.list}
              ListEmptyComponent={() => (
                <Text style={styles.emptyMessage}>Nenhum item cadastrado</Text>
              )}
              showsVerticalScrollIndicator={false}
              data={machines}
              keyExtractor={(item) => item.id}
              renderItem={(item) => (
                <HomeListItem
                  data={item.item}
                  onPress={() =>
                    navigate("details", {
                      id: item.item.id,
                      ns: item.item.ns,
                    })
                  }
                />
              )}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.smart.colors.gray_500,
    flex: 1,
  },

  header: {
    height: 130,
    width: "100%",
    paddingLeft: 30,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    backgroundColor: theme.smart.colors.gray_500,
  },
  headerText: {
    color: theme.smart.colors.gray_100,
    fontSize: theme.smart.fontSizes.lg,
  },
  headerTextUserName: {
    fontSize: theme.smart.fontSizes.lg,
    color: theme.smart.colors.secondary,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    opacity: 0.73,
    alignItems: "center",
    paddingRight: 12,
  },
  headerButton: {
    width: 50,
    height: 43,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  filterContainer: {
    backgroundColor: theme.smart.colors.gray_500,
    alignItems: "center",
  },
  filterHeader: {
    marginBottom: 15,
    width: "80%",
  },
  content: {
    backgroundColor: theme.smart.colors.gray_600,

    flex: 1,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  contentHeaderText: {
    color: theme.smart.colors.gray_200,
    fontWeight: "bold",
    fontSize: theme.smart.fontSizes.lg,
  },
  contentHeaderNumber: {
    color: theme.smart.colors.gray_200,
  },
  list: {},
  emptyMessage: {
    alignSelf: "center",
    marginTop: 30,
    color: theme.smart.colors.gray_300,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
