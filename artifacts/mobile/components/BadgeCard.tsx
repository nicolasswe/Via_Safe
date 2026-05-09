import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Badge } from "@/context/AppContext";

interface Props {
  badge: Badge;
}

export function BadgeCard({ badge }: Props) {
  const colors = useColors();

  const iconColor = badge.unlocked ? colors.primary : colors.mutedForeground;
  const bgColor = badge.unlocked ? colors.accent : colors.muted;
  const borderColor = badge.unlocked ? colors.primary : colors.border;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: borderColor,
          opacity: badge.unlocked ? 1 : 0.55,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <Feather
          name={badge.icon as keyof typeof Feather.glyphMap}
          size={24}
          color={iconColor}
        />
        {badge.unlocked && (
          <View style={[styles.checkMark, { backgroundColor: colors.safe }]}>
            <Feather name="check" size={8} color="#fff" />
          </View>
        )}
      </View>
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {badge.title}
      </Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
        {badge.description}
      </Text>
      {!badge.unlocked && (
        <View style={[styles.lockBadge, { backgroundColor: colors.muted }]}>
          <Feather name="lock" size={10} color={colors.mutedForeground} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 140,
    position: "relative",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  checkMark: {
    position: "absolute",
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    textAlign: "center",
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
  lockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
