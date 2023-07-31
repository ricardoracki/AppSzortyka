import { createContext, useState } from "react";

import { darkTheme, lightTheme } from "../../libraries/theme";

interface Theme {
  name: string;
  colors: any;
}

interface ITheme {
  toogleTheme: () => void;
  theme: Theme;
}

interface Props {
  children: React.ReactNode;
}

export const ThemeContext = createContext({} as ITheme);

export function ThemeContextProvider({ children }: Props) {
  const [theme, setTheme] = useState(darkTheme);

  const toogleTheme = () => {
    setTheme((v) => (v.name == "dark" ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toogleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
