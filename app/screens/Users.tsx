import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { onSnapshot, query } from "firebase/firestore";
import { UserListItem } from "../components/UserListItem";
import { Loading } from "../components/Loading";

import { theme } from "../../libraries/theme";
import { userCollection } from "../../services/firebaseApi";

export function Users({ navigation }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(userCollection);
    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        try {
          setIsLoading(true);
          const data: any[] = [];
          snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
          setUsers(data);
        } catch (e) {
          Alert.alert("Erro", "Ocorreu um erro inesperado");
        } finally {
          setIsLoading(false);
        }
      },
    });
    return subscriber;
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.contentHeader}>
            <Text style={styles.contentHeaderText}>Usuários</Text>
            <Text style={styles.contentHeaderNumber}>{users.length}</Text>
          </View>
          <FlatList
            style={styles.list}
            ListEmptyComponent={() => (
              <Text style={{ color: theme.colors.text }}>
                Nenhum item cadastrado
              </Text>
            )}
            showsVerticalScrollIndicator={false}
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
              <UserListItem
                data={item.item}
                onPress={() =>
                  navigation.navigate("userDetails", { id: item.item.id })
                }
              />
            )}
          />
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
  list: {},
  emptyMessage: {},
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
});
