import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { LearningModule } from "@/context/AppContext";

interface Props {
  module: LearningModule;
  onPress: () => void;
}

export function LearningCard({ module, onPress }: Props) {
  const colors = useColors();
  const progress = module.completedLessons / module.totalLessons;
  const isComplete = module.completedLessons === module.totalLessons;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: isComplete ? colors.safe : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[styles.iconBox, { backgroundColor: module.color + "20" }]}
        >
          <Feather
            name={module.icon as keyof typeof Feather.glyphMap}
            size={22}
            color={module.color}
          />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {module.title}
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {module.description}
          </Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={[styles.xpText, { color: colors.warning }]}>
            +{module.xpReward}
          </Text>
          <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>
            XP
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: isComplete ? colors.safe : module.color,
                width: `${progress * 100}%` as any,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
          {module.completedLessons}/{module.totalLessons} aulas
        </Text>
      </View>

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: isComplete
              ? colors.safe
              : pressed
              ? module.color + "BB"
              : module.color,
          },
        ]}
      >
        <Text style={styles.buttonText}>
          {isComplete
            ? "Concluído"
            : module.completedLessons > 0
            ? "Continuar"
            : "Iniciar"}
        </Text>
        {!isComplete && (
          <Feather name="arrow-right" size={14} color="#fff" />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
  xpBadge: {
    alignItems: "center",
  },
  xpText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  xpLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  progressSection: {
    gap: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
});
