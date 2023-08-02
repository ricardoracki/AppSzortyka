import { ImageSourcePropType } from "react-native";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      register: undefined;
      new: undefined | {};
      details: { id: string; ns: string };
      users: undefined;
      imageViewer: { source: ImageSourcePropType };
    }
  }
}
