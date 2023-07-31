import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { theme } from "../../libraries/theme";

interface Props extends TouchableOpacityProps {}

export function FloatingButton({ ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <FontAwesome name="plus" color={theme.smart.colors.gray_200} size={18} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 66,
    width: 66,
    borderRadius: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.smart.colors.green_700,

    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 2,
  },
});
