import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { theme as staticTheme } from "../../libraries/theme";

interface Props extends TouchableOpacityProps {
  checked: boolean;
}

export function CheckBox({ checked, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, rest.disabled && styles.disabled]}
      {...rest}
    >
      {checked && (
        <FontAwesome
          name="check"
          color={checked ? staticTheme.colors.success : "#fff"}
          size={20}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 22,
    height: 22,
  },
  disabled: {
    backgroundColor: staticTheme.colors.darGray,
  },
});
