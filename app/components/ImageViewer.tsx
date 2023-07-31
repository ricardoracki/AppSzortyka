import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { Loading } from "./Loading";

interface Props extends TouchableOpacityProps {
  source: ImageSourcePropType;
}

export function ImageViewer({ source, ...rest }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Image
        style={styles.image}
        source={source}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={styles.loading}>
          <Loading />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    marginRight: 15,
  },
  image: {
    flex: 1,
    borderRadius: 12,
  },
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: "#000c",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
