import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { theme as staticTheme } from "../../libraries/theme";
import { useTheme } from "../hooks/useTheme";

interface Props extends TouchableOpacityProps {
  data: any;
  variant?: "success" | "danger" | "info" | "warning";
}

export function HomeListItem({ data, variant, ...rest }: Props) {
  const { theme } = useTheme();

  let variantObject = {};
  if (variant) {
    variantObject = styles[variant];
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.listItemContainer,
        backgroundColor: theme.colors.text + "2",
        ...variantObject,
      }}
      {...rest}
    >
      <Text style={{ ...styles.listItemHeader, color: theme.colors.text }}>
        {data.ns}
      </Text>
      <Text style={styles.listItemDescription}>
        {data.type} - {data.customer} -{" "}
        {new Date(data.createdAt).toLocaleDateString("pt-br")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 12,

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: staticTheme.smart.radius.sm,
  },
  listItemHeader: {
    fontSize: staticTheme.smart.fontSizes.xxl,
  },
  listItemDescription: {
    fontSize: staticTheme.smart.fontSizes.md,
    color: staticTheme.smart.colors.gray_300,
  },

  danger: {
    borderLeftWidth: 1,
    borderLeftColor: staticTheme.colors.danger,
  },
  success: {
    borderLeftWidth: 1,
    borderLeftColor: staticTheme.colors.success,
  },
  warning: {
    borderLeftWidth: 1,
    borderLeftColor: staticTheme.colors.violet,
  },
  info: {
    borderLeftWidth: 1,
    borderLeftColor: staticTheme.colors.info,
  },
});
