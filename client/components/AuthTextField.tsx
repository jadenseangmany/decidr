import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  secureTextEntry?: boolean;
  rightIconName?: React.ComponentProps<typeof Ionicons>["name"];
  onPressRightIcon?: () => void;
};

export default function AuthTextField({
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry,
  rightIconName,
  onPressRightIcon,
}: Props) {
  return (
    <View style={styles.inputOuter}>
      <View style={styles.inputInner}>
        <Ionicons name={iconName} size={20} color={COLORS.border} style={styles.leftIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          style={[styles.input, rightIconName ? { paddingRight: 46 } : null]}
        />

        {rightIconName ? (
          <Pressable onPress={onPressRightIcon} style={styles.rightBtn} hitSlop={10}>
            <Ionicons name={rightIconName} size={20} color={COLORS.border} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputOuter: {
    width: "100%",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 6,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  inputInner: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  leftIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
  rightBtn: {
    position: "absolute",
    right: 10,
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
