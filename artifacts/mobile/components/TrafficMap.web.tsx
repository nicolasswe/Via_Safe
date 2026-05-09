import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export interface MapAlert {
  id: string;
  lat: number;
  lon: number;
  title: string;
  address: string;
  type: string;
}

export interface RouteCoord {
  latitude: number;
  longitude: number;
}

interface Props {
  alerts?: MapAlert[];
  alertColors?: Record<string, string>;
  showRoute?: boolean;
  routeCoords?: RouteCoord[];
  routeColor?: string;
  originColor?: string;
  destinationTitle?: string;
  interactive?: boolean;
}

const FRANCA_STREETS = [
  { label: "Av. Major Nicácio", x: "30%", y: "35%" },
  { label: "Av. Ademar P. Barros", x: "55%", y: "60%" },
  { label: "R. Frederico Moura", x: "50%", y: "40%" },
];

export function TrafficMap({ alerts = [], alertColors = {}, showRoute, routeColor = "#22C55E" }: Props) {
  const colors = useColors();

  const alertTypeEmoji: Record<string, string> = {
    acidente: "🔴",
    buraco: "🟡",
    semaforo: "🔵",
    fio_solto: "⚡",
    lento: "🟠",
    obra: "🟣",
  };

  const alertPositions = [
    { x: "28%", y: "32%" },
    { x: "55%", y: "62%" },
    { x: "48%", y: "43%" },
    { x: "35%", y: "55%" },
    { x: "65%", y: "38%" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.mapBg }]}>
      {/* Grid lines - road simulation */}
      {[15, 35, 55, 75].map((pos) => (
        <View
          key={`h${pos}`}
          style={[
            styles.hLine,
            { top: `${pos}%` as any, backgroundColor: colors.border },
          ]}
        />
      ))}
      {[20, 45, 65, 80].map((pos) => (
        <View
          key={`v${pos}`}
          style={[
            styles.vLine,
            { left: `${pos}%` as any, backgroundColor: colors.border },
          ]}
        />
      ))}

      {/* Main avenue highlight */}
      <View
        style={[
          styles.mainAvenue,
          { top: "35%", backgroundColor: colors.primary + "25" },
        ]}
      />

      {/* Street labels */}
      {FRANCA_STREETS.map((s) => (
        <View
          key={s.label}
          style={[styles.streetLabel, { left: s.x as any, top: s.y as any }]}
        >
          <Text style={[styles.streetLabelText, { color: colors.mutedForeground }]}>
            {s.label}
          </Text>
        </View>
      ))}

      {/* Alert markers */}
      {alerts.slice(0, 5).map((alert, i) => (
        <View
          key={alert.id}
          style={[
            styles.alertMarker,
            {
              left: alertPositions[i % alertPositions.length].x as any,
              top: alertPositions[i % alertPositions.length].y as any,
            },
          ]}
        >
          <Text style={styles.alertEmoji}>
            {alertTypeEmoji[alert.type] ?? "📍"}
          </Text>
        </View>
      ))}

      {/* Route line (if active) */}
      {showRoute && (
        <View
          style={[
            styles.routeLine,
            { backgroundColor: routeColor },
          ]}
        />
      )}

      {/* You are here */}
      <View style={[styles.youAreHere, { backgroundColor: colors.primary }]}>
        <Feather name="navigation" size={12} color="#fff" />
      </View>

      {/* City label */}
      <View style={[styles.cityLabel, { backgroundColor: colors.card + "DD" }]}>
        <Feather name="map-pin" size={10} color={colors.primary} />
        <Text style={[styles.cityLabelText, { color: colors.foreground }]}>
          Franca, SP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  hLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.5,
  },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    opacity: 0.5,
  },
  mainAvenue: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 14,
  },
  streetLabel: {
    position: "absolute",
  },
  streetLabelText: {
    fontSize: 8,
    fontFamily: "Inter_400Regular",
  },
  alertMarker: {
    position: "absolute",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  alertEmoji: {
    fontSize: 18,
  },
  routeLine: {
    position: "absolute",
    left: "30%",
    top: "30%",
    width: "40%",
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: "35deg" }],
  },
  youAreHere: {
    position: "absolute",
    left: "45%",
    top: "45%",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cityLabel: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cityLabelText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
