import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export type RouteType = "rapida" | "segura" | "tranquila";

interface Props {
  type: RouteType;
  selected: boolean;
  onSelect: () => void;
  time: string;
  distance: string;
  alertCount?: number;
}

const ROUTE_CONFIG: Record<
  RouteType,
  {
    label: string;
    sublabel: string;
    icon: keyof typeof Feather.glyphMap;
    color: string;
  }
> = {
  rapida: {
    label: "Mais Rápida",
    sublabel: "Via rota direta",
    icon: "zap",
    color: "#3B82F6",
  },
  segura: {
    label: "Mais Segura",
    sublabel: "Evita pontos críticos",
    icon: "shield",
    color: "#22C55E",
  },
  tranquila: {
    label: "Mais Tranquila",
    sublabel: "Menos congestionamento",
    icon: "wind",
    color: "#A78BFA",
  },
};

export function RouteOptionCard({
  type,
  selected,
  onSelect,
  time,
  distance,
  alertCount,
}: Props) {
  const colors = useColors();
  const config = ROUTE_CONFIG[type];

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
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: config.color + "20" }]}>
        <Feather name={config.icon} size={20} color={config.color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.foreground }]}>
          {config.label}
        </Text>
        <Text style={[styles.sublabel, { color: colors.mutedForeground }]}>
          {config.sublabel}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, { color: config.color }]}>{time}</Text>
        <Text style={[styles.distance, { color: colors.mutedForeground }]}>
          {distance}
        </Text>
        {alertCount !== undefined && alertCount > 0 && (
          <View style={[styles.alertBadge, { backgroundColor: colors.dangerBg }]}>
            <Feather name="alert-triangle" size={10} color={colors.danger} />
            <Text style={[styles.alertText, { color: colors.danger }]}>
              {alertCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  sublabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  time: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  distance: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  alertBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  alertText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
  },
});
