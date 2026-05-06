import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Alert } from "@/context/AppContext";

const ALERT_CONFIG: Record<
  Alert["type"],
  { icon: keyof typeof Feather.glyphMap; label: string }
> = {
  acidente: { icon: "alert-triangle", label: "Acidente" },
  buraco: { icon: "circle", label: "Buraco" },
  semaforo: { icon: "radio", label: "Semáforo" },
  fio_solto: { icon: "zap-off", label: "Fio Solto" },
  lento: { icon: "clock", label: "Lento" },
  obra: { icon: "tool", label: "Obra" },
};

interface Props {
  alert: Alert;
}

export function AlertItem({ alert }: Props) {
  const colors = useColors();
  const config = ALERT_CONFIG[alert.type];

  const severityColor = {
    high: colors.danger,
    medium: colors.warning,
    low: colors.primary,
  }[alert.severity];

  const severityBg = {
    high: colors.dangerBg,
    medium: colors.warningBg,
    low: colors.accent,
  }[alert.severity];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: severityBg }]}>
        <Feather name={config.icon} size={18} color={severityColor} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {alert.title}
        </Text>
        <Text style={[styles.address, { color: colors.mutedForeground }]}>
          {alert.address}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.dot, { backgroundColor: severityColor }]} />
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {alert.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  address: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
});
