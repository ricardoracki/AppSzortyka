import { useState } from "react";
import { StyleSheet, View, Text, ToastAndroid, Alert } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import { SmartInputBlock } from "../components/SmartInputBlock";
import { SmartButton } from "../components/SmartButton";

import { theme } from "../../libraries/theme";
import { User } from "../../services/firebaseApi/controllers/user";

export function RegisterUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [userExistsError, setUserExistisError] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { goBack } = useNavigation();

  async function onSubmit() {
    if (!name || !password)
      return ToastAndroid.show("Preencha todos os campos", ToastAndroid.SHORT);

    if (password != repeatPassword) {
      setRepeatPasswordError(true);
      return ToastAndroid.show(
        "As senhas devem ser iguais",
        ToastAndroid.SHORT
      );
    }

    try {
      setUserExistisError(false);
      setRepeatPasswordError(false);
      setIsLoading(true);

      await User.registerNewUser({
        name,
        password,
        active: false,
        role: "guest",
      });

      Alert.alert(
        "Sucesso!",
        "Seu cadastro foi  realizado com sucesso! Aguarde algum administrador aprovar seu cadastro.",
        [{ text: "Ok", onPress: () => goBack() }]
      );
    } catch (e) {
      //@ts-ignore
      if (e.message == "USER_EXISTS") {
        setUserExistisError(true);
        Alert.alert("Erro", "Usuário já cadastrado!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Crie a sua conta</Text>
      <SmartInputBlock
        placeholder="Usuário"
        placeholderTextColor={theme.smart.colors.gray_300}
        editable={!isLoading}
        onChangeText={setName}
        errorMessage={userExistsError ? "Tente outro nome" : ""}
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

      <SmartInputBlock
        placeholder="Repetir Senha"
        placeholderTextColor={theme.smart.colors.gray_300}
        editable={!isLoading}
        onChangeText={setRepeatPassword}
        errorMessage={repeatPasswordError ? "As senhas devem ser iguais" : ""}
        secureTextEntry={true}
      >
        <Entypo
          name="key"
          size={theme.smart.fontSizes.xl}
          color={theme.smart.colors.gray_300}
        />
      </SmartInputBlock>

      <SmartButton label="Cadastrar" onPress={onSubmit} isLoading={isLoading} />
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
});
