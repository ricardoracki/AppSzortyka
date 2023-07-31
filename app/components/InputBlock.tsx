import { View, TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface Props extends TextInputProps {}

export function InputBlock({ ...rest }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        rest.multiline && styles.big,
        { backgroundColor: theme.colors.text + "2" },
      ]}
    >
      <TextInput
        {...rest}
        style={{
          ...styles.input,
          color: theme.colors.text,
        }}
        placeholderTextColor={theme.colors.text + "4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    marginBottom: 20,

    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  input: {},
  big: {
    height: 200,
    paddingTop: 10,
    justifyContent: "flex-start",
  },
});
