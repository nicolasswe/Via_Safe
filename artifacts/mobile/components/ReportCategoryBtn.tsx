import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { ReportCategory } from "@/context/AppContext";

const CATEGORY_CONFIG: Record<
  ReportCategory,
  {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    color: string;
  }
> = {
  acidente: { label: "Acidente", icon: "alert-triangle", color: "#EF4444" },
  buraco: { label: "Buraco", icon: "circle", color: "#F59E0B" },
  semaforo: { label: "Semáforo\nQuebrado", icon: "radio", color: "#3B82F6" },
  sinalizacao: { label: "Sinalização\nDanificada", icon: "map", color: "#8B5CF6" },
  fio_solto: { label: "Fio Solto", icon: "zap-off", color: "#EF4444" },
  imprudente: { label: "Motorista\nImprudente", icon: "user-x", color: "#F97316" },
};

interface Props {
  category: ReportCategory;
  selected: boolean;
  onSelect: () => void;
}

export function ReportCategoryBtn({ category, selected, onSelect }: Props) {
  const colors = useColors();
  const config = CATEGORY_CONFIG[category];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: selected ? config.color + "18" : colors.card,
          borderColor: selected ? config.color : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: config.color + (selected ? "30" : "18") },
        ]}
      >
        <Feather name={config.icon} size={22} color={config.color} />
      </View>
      <Text
        style={[
          styles.label,
          { color: selected ? config.color : colors.foreground },
        ]}
        numberOfLines={2}
        textBreakStrategy="balanced"
      >
        {config.label}
      </Text>
    </Pressable>
  );
}

export { CATEGORY_CONFIG };

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 90,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
});
