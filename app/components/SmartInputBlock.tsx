import { ReactNode, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
} from "react-native";

import { theme } from "../../libraries/theme";
import { Ionicons } from "@expo/vector-icons";

interface Props extends TextInputProps {
  children?: React.ReactNode;
  errorMessage?: string;
  endOfLineComponent?: ReactNode;
}

export function SmartInputBlock({
  children,
  endOfLineComponent,
  errorMessage,
  secureTextEntry,
  ...rest
}: Props) {
  const [disableSecureEntry, setDisableSecureEntry] = useState(false);

  const inputRef = useRef<any>(null);

  function focus() {
    inputRef.current.focus();
  }

  return (
    <TouchableWithoutFeedback onPress={focus}>
      <View
        style={[
          styles.inputBlock,
          errorMessage ? styles.errorBorder : null,
          rest.multiline
            ? {
                minHeight: 146,
                flex: 1,
                alignItems: "flex-start",
                paddingTop: 10,
              }
            : null,
        ]}
      >
        {children}
        <View style={styles.inputArea}>
          <TextInput
            style={[styles.input, rest.multiline ? { width: "100%" } : null]}
            {...rest}
            ref={inputRef}
            selectTextOnFocus={true}
            secureTextEntry={!disableSecureEntry && secureTextEntry}
          />
          {endOfLineComponent}
          {secureTextEntry && (
            <TouchableWithoutFeedback
              onPress={() => setDisableSecureEntry((v) => !v)}
            >
              <Ionicons
                name={
                  !disableSecureEntry ? "ios-eye-sharp" : "ios-eye-off-sharp"
                }
                size={24}
                color={theme.smart.colors.gray_300}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputBlock: {
    backgroundColor: theme.smart.colors.gray_700,
    flexDirection: "row",
    width: "85%",
    alignItems: "center",
    borderRadius: theme.smart.radius.sm,
    height: 73,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  input: {
    fontSize: theme.smart.fontSizes.lg,
    color: theme.smart.colors.gray_200,
    marginLeft: 8,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  errorMessage: {
    color: theme.colors.danger,
    position: "absolute",
    bottom: -15,
    left: 10,
    fontSize: theme.smart.fontSizes.sm,
  },
  inputArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
});
