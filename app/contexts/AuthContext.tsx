import { createContext, useState } from "react";
import { useMMKVObject, useMMKVBoolean, MMKV } from "react-native-mmkv";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as Auth.Context);

export function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useMMKVObject<Auth.IUser>("user");
  const [authenticated, setAuthenticated] = useMMKVBoolean("authenticated");
  function login(u: Auth.IUser) {
    setUser(u);
    setAuthenticated(true);
  }

  function logout() {
    setUser({} as Auth.IUser);
    setAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
