import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteOptionCard, RouteType } from "@/components/RouteOptionCard";
import { TrafficMap } from "@/components/TrafficMap";
import { useColors } from "@/hooks/useColors";

type Modal = "carro" | "moto" | "bicicleta" | "pedestre";

const MODAL_CONFIG: Record<
  Modal,
  { label: string; icon: keyof typeof Feather.glyphMap }
> = {
  carro: { label: "Carro", icon: "navigation" },
  moto: { label: "Moto", icon: "zap" },
  bicicleta: { label: "Bicicleta", icon: "wind" },
  pedestre: { label: "A Pé", icon: "user" },
};

const ROUTES_DATA: Record<
  RouteType,
  { time: string; distance: string; alertCount: number }
> = {
  rapida: { time: "12 min", distance: "4.2 km", alertCount: 2 },
  segura: { time: "17 min", distance: "5.8 km", alertCount: 0 },
  tranquila: { time: "19 min", distance: "6.1 km", alertCount: 0 },
};

const ROUTE_ALERTS: Record<RouteType, string[]> = {
  rapida: [
    "Acidente registrado na Av. Major Nicácio",
    "Trânsito lento no centro",
  ],
  segura: [],
  tranquila: [],
};

const ROUTE_COORDS: Record<RouteType, { latitude: number; longitude: number }[]> = {
  rapida: [
    { latitude: -20.5386, longitude: -47.4006 },
    { latitude: -20.537, longitude: -47.4025 },
    { latitude: -20.5395, longitude: -47.404 },
  ],
  segura: [
    { latitude: -20.5386, longitude: -47.4006 },
    { latitude: -20.536, longitude: -47.3995 },
    { latitude: -20.534, longitude: -47.397 },
  ],
  tranquila: [
    { latitude: -20.5386, longitude: -47.4006 },
    { latitude: -20.541, longitude: -47.399 },
    { latitude: -20.543, longitude: -47.397 },
  ],
};

const ROUTE_COLORS: Record<RouteType, string> = {
  rapida: "#3B82F6",
  segura: "#22C55E",
  tranquila: "#A78BFA",
};

const POPULAR_DESTINATIONS = [
  "UPA Franca",
  "Shopping Iguatemi Franca",
  "Terminal Rodoviário",
  "Parque Zilda Arns",
  "UNESP Franca",
];

export default function RotasScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState("");
  const [selectedModal, setSelectedModal] = useState<Modal>("carro");
  const [selectedRoute, setSelectedRoute] = useState<RouteType>("segura");
  const [searching, setSearching] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const handleSearch = (dest: string) => {
    setDestination(dest);
    setSearching(false);
    setNavigating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleStartNavigation = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            paddingTop: topInset + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Planejar Rota
        </Text>

        {/* Search bar */}
        <Pressable
          style={[
            styles.searchBar,
            { backgroundColor: colors.muted, borderColor: searching ? colors.primary : "transparent" },
          ]}
          onPress={() => setSearching(true)}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          {searching ? (
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Para onde vamos?"
              placeholderTextColor={colors.mutedForeground}
              value={destination}
              onChangeText={setDestination}
              autoFocus
              onSubmitEditing={() => handleSearch(destination)}
              returnKeyType="search"
            />
          ) : (
            <Text
              style={[
                styles.searchPlaceholder,
                { color: destination ? colors.foreground : colors.mutedForeground },
              ]}
            >
              {destination || "Para onde vamos?"}
            </Text>
          )}
          {destination !== "" && (
            <Pressable
              onPress={() => {
                setDestination("");
                setNavigating(false);
              }}
            >
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </Pressable>

        {/* Suggestions */}
        {searching && (
          <View
            style={[
              styles.suggestions,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {POPULAR_DESTINATIONS.filter((d) =>
              d.toLowerCase().includes(destination.toLowerCase())
            ).map((d) => (
              <Pressable
                key={d}
                style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                onPress={() => handleSearch(d)}
              >
                <Feather name="map-pin" size={14} color={colors.primary} />
                <Text style={[styles.suggestionText, { color: colors.foreground }]}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Modal selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modalSelector}
        >
          {(Object.keys(MODAL_CONFIG) as Modal[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => {
                setSelectedModal(m);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.modalChip,
                {
                  backgroundColor:
                    selectedModal === m ? colors.primary : colors.muted,
                  borderColor:
                    selectedModal === m ? colors.primary : "transparent",
                },
              ]}
            >
              <Feather
                name={MODAL_CONFIG[m].icon}
                size={14}
                color={selectedModal === m ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.modalChipText,
                  {
                    color:
                      selectedModal === m ? "#fff" : colors.mutedForeground,
                  },
                ]}
              >
                {MODAL_CONFIG[m].label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Map */}
        <View style={styles.mapContainer}>
          <TrafficMap
            showRoute={navigating}
            routeCoords={ROUTE_COORDS[selectedRoute]}
            routeColor={ROUTE_COLORS[selectedRoute]}
            destinationTitle={destination}
            interactive={true}
          />
        </View>

        {navigating ? (
          <View style={styles.routeSection}>
            <Text
              style={[styles.sectionTitle, { color: colors.foreground }]}
            >
              Escolha a rota
            </Text>
            <Text
              style={[styles.destination, { color: colors.mutedForeground }]}
            >
              Destino: {destination}
            </Text>

            <View style={styles.routeOptions}>
              {(["rapida", "segura", "tranquila"] as RouteType[]).map((r) => (
                <RouteOptionCard
                  key={r}
                  type={r}
                  selected={selectedRoute === r}
                  onSelect={() => setSelectedRoute(r)}
                  time={ROUTES_DATA[r].time}
                  distance={ROUTES_DATA[r].distance}
                  alertCount={ROUTES_DATA[r].alertCount}
                />
              ))}
            </View>

            {ROUTE_ALERTS[selectedRoute].length > 0 && (
              <View
                style={[
                  styles.alertBanner,
                  { backgroundColor: colors.warningBg, borderColor: colors.warning },
                ]}
              >
                <Feather name="alert-triangle" size={16} color={colors.warning} />
                <View style={{ flex: 1 }}>
                  {ROUTE_ALERTS[selectedRoute].map((a, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.alertText,
                        { color: colors.foreground },
                      ]}
                    >
                      {a}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            <Pressable
              onPress={handleStartNavigation}
              style={({ pressed }) => [
                styles.startBtn,
                {
                  backgroundColor: pressed
                    ? colors.primary + "CC"
                    : colors.primary,
                },
              ]}
            >
              <Feather name="navigation" size={18} color="#fff" />
              <Text style={styles.startBtnText}>Iniciar Navegação</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="map" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Onde você quer ir?
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Digite seu destino acima e escolha a rota mais segura para você
            </Text>

            <View style={styles.quickDestinations}>
              <Text
                style={[styles.quickTitle, { color: colors.mutedForeground }]}
              >
                Destinos populares
              </Text>
              {POPULAR_DESTINATIONS.slice(0, 3).map((d) => (
                <Pressable
                  key={d}
                  onPress={() => handleSearch(d)}
                  style={[
                    styles.quickItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather name="map-pin" size={16} color={colors.primary} />
                  <Text
                    style={[
                      styles.quickItemText,
                      { color: colors.foreground },
                    ]}
                  >
                    {d}
                  </Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
    zIndex: 20,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    padding: 0,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  suggestions: {
    position: "absolute",
    top: 140,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 100,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  modalSelector: {
    gap: 8,
  },
  modalChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  modalChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: "hidden",
    height: 220,
  },
  map: {
    flex: 1,
  },
  routeSection: {
    gap: 14,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  destination: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: -6,
  },
  routeOptions: {
    gap: 10,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  startBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    marginTop: 12,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  quickDestinations: {
    width: "100%",
    gap: 8,
  },
  quickTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  quickItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  quickItemText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    flex: 1,
  },
});
