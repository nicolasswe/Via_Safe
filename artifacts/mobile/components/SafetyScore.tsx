import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  score: number;
  size?: number;
}

export function SafetyScore({ score, size = 120 }: Props) {
  const colors = useColors();
  const animatedScore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const getColor = () => {
    if (score >= 80) return colors.safe;
    if (score >= 60) return colors.warning;
    return colors.danger;
  };

  const getLabel = () => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    return "Atenção";
  };

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const scoreColor = getColor();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.svgContainer}>
        {/* Background ring */}
        <View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: colors.border,
            },
          ]}
        />
        {/* Score arc - simulated with color */}
        <View
          style={[
            styles.ringFill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: scoreColor,
              borderRightColor: "transparent",
              borderBottomColor: score > 50 ? scoreColor : "transparent",
              transform: [{ rotate: "-90deg" }],
            },
          ]}
        />
      </View>
      <View style={styles.center}>
        <Text style={[styles.score, { color: scoreColor, fontSize: size * 0.28 }]}>
          {score}
        </Text>
        <Text style={[styles.label, { color: colors.mutedForeground, fontSize: size * 0.11 }]}>
          {getLabel()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ring: {
    position: "absolute",
  },
  ringFill: {
    position: "absolute",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontFamily: "Inter_700Bold",
    lineHeight: undefined,
  },
  label: {
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
});
