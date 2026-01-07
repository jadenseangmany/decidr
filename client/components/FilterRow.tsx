import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { COLORS } from "@/constants/theme";

interface FilterRowProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step: number;
  onValueChange: (val: number) => void;
}

export default function FilterRow({
  label,
  value,
  unit = "",
  min,
  max,
  step,
  onValueChange,
}: FilterRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelOval}>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <Slider
        style={{ flex: 1, marginHorizontal: 10 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={COLORS.textDark}
        maximumTrackTintColor="#A0A0A0"
        thumbTintColor={COLORS.highlightOrange}
      />

      <View style={styles.valueOval}>
        <Text style={styles.valueText}>
          {value}
          {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    fontFamily: "Quicksand",
  },
  labelOval: {
    backgroundColor: COLORS.main,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 80,
    alignItems: "center",
  },
  labelText: {
    color: COLORS.textLight,
    fontWeight: "bold",
  },
  valueOval: {
    backgroundColor: COLORS.highlightYellow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 70,
    alignItems: "center",
  },
  valueText: {
    color: COLORS.textDark,
    fontWeight: "bold",
  },
});
