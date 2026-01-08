import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { COLORS } from "../constants/theme";

interface DropdownRowProps {
  label: string;
  selectedValue: string;
  options: string[];
  onSelect: (val: any) => void;
}

export default function DropdownRow({
  label,
  selectedValue,
  options,
  onSelect,
}: DropdownRowProps) {
  const [visible, setVisible] = useState(false);

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedValue;
    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.selectedOptionItem]}
        onPress={() => {
          onSelect(item);
          setVisible(false);
        }}
      >
        <Text
          style={[styles.optionText, isSelected && styles.selectedOptionText]}
        >
          {item}
        </Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelOval}>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <TouchableOpacity
        style={styles.valueOval}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.valueText} numberOfLines={1}>
          {selectedValue}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderCharms} />
            <Text style={styles.modalTitle}>Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={renderItem}
              bounces={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "space-between",
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
  labelText: { color: COLORS.textLight, fontWeight: "bold" },
  valueOval: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.highlightYellow,
    marginLeft: 0,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: 200,
    alignItems: "center",
  },
  valueText: { fontWeight: "bold", color: COLORS.textDark, flex: 1, textAlign: "center" },
  arrow: { fontSize: 12, color: COLORS.textDark },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "50%",
    borderWidth: 2,
    borderColor: "#E0D8C3",
    borderBottomWidth: 0,
  },
  modalHeaderCharms: {
    alignSelf: "center",
    width: 40,
    height: 5,
    backgroundColor: "#CFC7B3",
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: COLORS.textDark,
    fontFamily: "serif",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D2C0",
  },
  selectedOptionItem: { backgroundColor: "#E3DCC7" },
  optionText: { fontSize: 18, color: COLORS.textDark },
  selectedOptionText: { color: COLORS.main, fontWeight: "bold" },
  checkmark: { color: COLORS.main, fontWeight: "bold", fontSize: 18 },
});
