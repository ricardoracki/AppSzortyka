import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { theme } from "../../libraries/theme";

interface Props extends TouchableOpacityProps {
  label: string;
  isLoading?: boolean;
  bgColor?: string;
  labelColor?: string;
}

export function SmartButton({
  isLoading,
  label,
  labelColor,
  bgColor,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      {...rest}
      style={[
        styles.button,
        { backgroundColor: bgColor ? bgColor : theme.smart.colors.green_700 },
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.smart.colors.gray_200} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: labelColor ? labelColor : theme.smart.colors.gray_200 },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    height: 73,
    borderRadius: theme.smart.radius.sm,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: theme.smart.fontSizes.md,
  },
});
