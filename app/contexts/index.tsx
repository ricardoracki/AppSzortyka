import { AuthContextProvider } from "./AuthContext"
import { ThemeContextProvider } from "./ThemeContext"

interface Props {
    children: React.ReactNode
}

export function Contexts({children}: Props) {
    return <AuthContextProvider><ThemeContextProvider>{children}</ThemeContextProvider></AuthContextProvider>
}