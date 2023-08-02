import React from "react";
import { TouchableOpacity , StyleSheet, View, Text} from "react-native";
import { theme } from "../../libraries/theme";

interface Props {
    onClose: () => void;
    show: boolean;
    position: {
        left?: any;
        right?: any;
        top?: any;
        bottom?: any;
        
    };
    
    children?: React.ReactNode | React.ReactNode[]; 
}


export function FloatingBox({onClose, show, position, children}: Props){
    return <TouchableOpacity onPress={onClose} style={{...styles.container, display: show ? "flex" : "none",}}>
        <View style={{...styles.box, ...position}}>{children}</View>
    </TouchableOpacity>
}

interface BoxItemProps {
    onPress: () => void;
    label: string;
    children?: React.ReactNode;
   
}

export function BoxItem({label, onPress, children}: BoxItemProps) {
    return<TouchableOpacity onPress={onPress} style={styles.boxItem}>
        <View style={styles.row}>
            {children && <View style={styles.icon}>{children}</View>}
        <Text style={styles.label}>{label}</Text>
        </View>

    </TouchableOpacity>
}

export function Divider() {
    return <View style={styles.divider}></View>
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 5,
    },
    box: {
        backgroundColor: theme.colors.jet,
        position: "absolute",
        borderRadius: 10,
        alignItems: "flex-start",
        paddingHorizontal: 15,
        minWidth: 100,
    },

    boxItem: {
        paddingVertical: 15,
        opacity: 0.76,
        width: "100%",
    },
    icon: {
        width: 20,
        alignItems: "center"
    },
    label: {
        color: theme.colors.text,
        marginLeft: 10,
        opacity: 0.76
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: theme.colors.text + "2"
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    }
})