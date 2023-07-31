import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import NetInfo from "@react-native-community/netinfo";

import { NewMachine } from "../screens/NewMachine";
import { Login } from "../screens/Login";
import { useAuth } from "../hooks/useAuth";
import { ImageViewer } from "../screens/ImageViewer";
import { Users } from "../screens/Users";
import { UserDetails } from "../screens/UserDetails";

import { RegisterUser } from "../screens/RegisterUser";
import { NewHome } from "../screens/NewHome";
import { theme } from "../../libraries/theme";
import { NewDetails } from "../screens/NewDetails";
import { ConnectionLost } from "../screens/ConnectionLost";
import { User } from "../../services/firebaseApi/controllers/user";
import { SpashScreen } from "../screens/SpashScreen";

const Stack = createNativeStackNavigator();

export function Routes() {
  const [connected, setConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { authenticated, user, logout, login } = useAuth();
  NavigationBar.setBackgroundColorAsync(theme.smart.colors.gray_600);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        if (authenticated && user) {
          User.getUserById(user.id).then((u) => {
            if (!u || !u.active) logout();
            else login(u as Auth.IUser);

            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } else {
        setConnected(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar translucent={true} style={"light"} />
      {isLoading ? (
        <Stack.Navigator>
          <Stack.Screen
            name="splash"
            component={connected ? SpashScreen : ConnectionLost}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <>
          {authenticated ? (
            <Stack.Navigator
              screenOptions={{ animation: "fade_from_bottom" }}
              initialRouteName="home"
            >
              <Stack.Screen
                name="home"
                component={NewHome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="details"
                component={NewDetails}
                options={{
                  title: "Detalhes",
                  headerTintColor: theme.colors.text,
                  headerStyle: { backgroundColor: theme.smart.colors.gray_500 },
                }}
              />
              <Stack.Screen
                name="imageViewer"
                component={ImageViewer}
                options={{
                  title: "Imagem",
                  headerTintColor: theme.colors.text,
                  headerStyle: { backgroundColor: theme.smart.colors.gray_500 },
                }}
              />
              <Stack.Screen
                name="new"
                component={NewMachine}
                options={{
                  title: "Novo Registro",
                  headerTintColor: theme.colors.text,
                  headerStyle: {
                    backgroundColor: theme.smart.colors.gray_500,
                  },
                }}
              />

              <Stack.Screen
                name="users"
                component={Users}
                options={{
                  title: "Usuários",
                  headerTintColor: theme.colors.text,
                  headerStyle: { backgroundColor: theme.smart.colors.gray_500 },
                }}
              />
              <Stack.Screen
                name="userDetails"
                component={UserDetails}
                options={{
                  title: "Usuário",
                  headerTintColor: theme.colors.text,
                  headerStyle: { backgroundColor: theme.smart.colors.gray_500 },
                }}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              screenOptions={{ animation: "fade_from_bottom" }}
              initialRouteName="login"
            >
              <Stack.Screen
                name="login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="register"
                component={RegisterUser}
                options={{
                  title: "Novo Usuário",
                  headerTintColor: theme.colors.text,
                  headerStyle: { backgroundColor: theme.colors.background },
                }}
              />
            </Stack.Navigator>
          )}
        </>
      )}
    </NavigationContainer>
  );
}
