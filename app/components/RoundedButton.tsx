import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { theme as staticTheme } from "../../libraries/theme";

interface Props extends TouchableOpacityProps {
  variant?: "success" | "danger" | "info" | "warning";
  children: React.ReactNode;
  size?: "default" | "small";
}

export function RoundedButton({
  variant = "success",
  size = "default",
  children,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={[
        { ...styles.button, ...styles[variant] },
        size == "small" && styles.small,
      ]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    width: 42,
    height: 42,
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    width: 37,
    height: 37,
  },
  warning: {
    backgroundColor: staticTheme.smart.colors.secondary,
  },
  danger: {
    backgroundColor: staticTheme.colors.danger,
  },
  info: {
    backgroundColor: staticTheme.smart.colors.primary,
  },
  success: {
    backgroundColor: staticTheme.colors.success,
  },
});
