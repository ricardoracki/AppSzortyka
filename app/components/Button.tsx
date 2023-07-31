import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../libraries/theme";
import { Loading } from "./Loading";

interface Props extends TouchableOpacityProps {
  label: string;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: "success" | "danger" | "info" | "warning";
}

export function Button({
  label,
  variant = "info",
  isLoading = false,
  loadingLabel,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: theme.colors[variant],
        opacity: isLoading ? 0.75 : 1,
      }}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={"#fff"} />
      ) : (
        <Text style={styles.label}>
          {isLoading ? loadingLabel || label : label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    height: 60,
    width: "100%",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontSize: 19,
  },
});
