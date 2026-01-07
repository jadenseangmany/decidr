import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator, ViewStyle, Image } from "react-native";
import { COLORS } from "@/constants/colors";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftImage?: any;
  rightImage?: any;
  style?: ViewStyle;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  leftImage,
  rightImage,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      {leftImage ? <Image source={leftImage} style={styles.btnLeftImg} /> : null}
      {rightImage ? <Image source={rightImage} style={styles.btnRightImg} /> : null}

      {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 74,
    borderRadius: 12,
    backgroundColor: COLORS.button,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { fontSize: 22, fontWeight: "900", color: "#000" },
  btnLeftImg: {
    position: "absolute",
    left: 10,
    bottom: 0,
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  btnRightImg: {
    position: "absolute",
    right: 10,
    bottom: 0,
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
});
