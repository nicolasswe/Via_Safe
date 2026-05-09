import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Challenge } from "@/context/AppContext";

interface Props {
  challenge: Challenge;
  onComplete: () => void;
}

export function DayChallenge({ challenge, onComplete }: Props) {
  const colors = useColors();

  const handleComplete = () => {
    if (challenge.completed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: challenge.completed ? colors.safeBg : colors.card,
          borderColor: challenge.completed ? colors.safe : colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Feather
            name="zap"
            size={12}
            color={colors.primary}
          />
          <Text style={[styles.badgeText, { color: colors.primary }]}>
            DESAFIO DO DIA
          </Text>
        </View>
        <Text style={[styles.xp, { color: colors.warning }]}>
          +{challenge.xpReward} XP
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>
        {challenge.title}
      </Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>
        {challenge.description}
      </Text>

      <Pressable
        onPress={handleComplete}
        disabled={challenge.completed}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: challenge.completed
              ? colors.safe
              : pressed
              ? colors.primary + "CC"
              : colors.primary,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Feather
          name={challenge.completed ? "check" : "flag"}
          size={14}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {challenge.completed ? "Concluído!" : "Concluir Desafio"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  xp: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 4,
  },
  buttonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
});
