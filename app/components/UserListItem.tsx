import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { theme as staticTheme } from "../../libraries/theme";
import { useTheme } from "../hooks/useTheme";

interface Props extends TouchableOpacityProps {
  data: Auth.IUser;
}

export function UserListItem({ data, ...rest }: Props) {
  const { theme } = useTheme();

  let variantObject = {};

  if (data.role == "owner") variantObject = styles.danger;
  else if (data.role == "mod") variantObject = styles.info;

  return (
    <TouchableOpacity
      style={{
        ...styles.listItemContainer,
        ...variantObject,
        backgroundColor: theme.colors.text + "2",
      }}
      {...rest}
    >
      <Text style={{ ...styles.listItemHeader, color: theme.colors.text }}>
        {data.name}
      </Text>
      <Text style={{ ...styles.listItemDescription, color: theme.colors.text }}>
        {data.role}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 12,

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  listItemHeader: {
    fontSize: 23,
  },
  listItemDescription: {
    fontSize: 16,

    opacity: 0.4,
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
