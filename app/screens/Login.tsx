import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { theme } from "../../libraries/theme";
import { useAuth } from "../hooks/useAuth";

import { User } from "../../services/firebaseApi/controllers/user";
import { SmartInputBlock } from "../components/SmartInputBlock";
import { SmartButton } from "../components/SmartButton";

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const { navigate } = useNavigation();

  async function onSubmit() {
    if (!name || !password)
      return ToastAndroid.show("Preencha todos os campos", ToastAndroid.SHORT);

    try {
      setIsLoading(true);
      const user = await User.getUserByCredentials(name, password);

      if (!user)
        return ToastAndroid.show(
          "Usuário ou senha inválidos!",
          ToastAndroid.SHORT
        );
      if (!user.active)
        return Alert.alert(
          "Aguarde",
          "Seu cadastro precisa ser aprovador por algum administrador!"
        );
      login(user);
    } catch (e) {
      return ToastAndroid.show(
        "Erro inesperado ao conectar com o servidor!",
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Acesse sua conta</Text>
      <SmartInputBlock
        placeholder="Usuário"
        placeholderTextColor={theme.smart.colors.gray_300}
        editable={!isLoading}
        onChangeText={setName}
      >
        <AntDesign
          name="user"
          size={theme.smart.fontSizes.xl}
          color={theme.smart.colors.gray_300}
        />
      </SmartInputBlock>

      <SmartInputBlock
        placeholder="Senha"
        placeholderTextColor={theme.smart.colors.gray_300}
        editable={!isLoading}
        onChangeText={setPassword}
        secureTextEntry={true}
      >
        <Entypo
          name="key"
          size={theme.smart.fontSizes.xl}
          color={theme.smart.colors.gray_300}
        />
      </SmartInputBlock>
      <Text>{process.env.EXPO_PUBLIC_my_env}</Text>

      <SmartButton
        label="Entrar"
        onPress={onSubmit}
        isLoading={isLoading}
        bgColor={theme.smart.colors.primary}
      />

      <TouchableOpacity onPress={() => navigate("register")}>
        <Text style={styles.linkText}>Não Possuo Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.smart.colors.gray_600,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: theme.smart.colors.gray_100,
    marginBottom: 26,
    fontSize: theme.smart.fontSizes.xl,
  },
  inputBlock: {
    backgroundColor: theme.smart.colors.gray_700,
    flexDirection: "row",
    width: "85%",
    alignItems: "center",
    borderRadius: theme.smart.radius.sm,
    height: 73,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  linkText: {
    color: theme.colors.info,
  },
});
