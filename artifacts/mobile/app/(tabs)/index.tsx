import { Feather } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertItem } from "@/components/AlertItem";
import { DayChallenge } from "@/components/DayChallenge";
import { SafetyScore } from "@/components/SafetyScore";
import { TrafficMap } from "@/components/TrafficMap";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ALERT_COLORS: Record<string, string> = {
  acidente: "#EF4444",
  buraco: "#F59E0B",
  semaforo: "#3B82F6",
  fio_solto: "#EF4444",
  lento: "#FF6B2C",
  obra: "#8B5CF6",
};

const NEWS_CARDS = [
  {
    id: "n1",
    tag: "Alerta",
    title: "Av. Major Nicácio lidera em acidentes em 2026",
    time: "2h atrás",
    color: "#EF4444",
  },
  {
    id: "n2",
    tag: "Dica",
    title: "Como reduzir o estresse no trânsito de Franca",
    time: "5h atrás",
    color: "#22C55E",
  },
  {
    id: "n3",
    tag: "Campanha",
    title: "\"Vozes do Trânsito\": depoimentos que salvam vidas",
    time: "1d atrás",
    color: "#3B82F6",
  },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { safetyScore, xp, level, challenges, alerts, completeChallenge } =
    useApp();
  const scrollY = useRef(new Animated.Value(0)).current;

  const topChallenge = challenges[0];

  const headerBg = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: ["transparent", colors.card],
    extrapolate: "clamp",
  });

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Floating Header */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBg, paddingTop: topInset },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerApp, { color: colors.primary }]}>
              Franca Segura
            </Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              Cuide do trânsito da sua cidade
            </Text>
          </View>
          <View style={styles.xpBadge}>
            <Feather name="award" size={14} color={colors.warning} />
            <Text style={[styles.xpText, { color: colors.warning }]}>
              {xp} XP
            </Text>
            <Text style={[styles.levelText, { color: colors.mutedForeground }]}>
              · Nível {level}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topInset + 64,
            paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Score + Map block */}
        <View style={[styles.heroCard, { backgroundColor: colors.navy }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={[styles.heroTitle, { color: "#F0F4F8" }]}>
                Pontuação de Segurança
              </Text>
              <Text style={[styles.heroSub, { color: "#8899A6" }]}>
                Hoje em Franca
              </Text>
            </View>
            <SafetyScore score={safetyScore} size={90} />
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <TrafficMap
              alerts={alerts}
              alertColors={ALERT_COLORS}
            />
            <View style={styles.mapOverlay}>
              <View style={[styles.mapBadge, { backgroundColor: colors.navy + "CC" }]}>
                <Feather name="map-pin" size={11} color={colors.primary} />
                <Text style={styles.mapBadgeText}>
                  {alerts.length} alertas ativos
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Desafio do dia */}
        {topChallenge && (
          <DayChallenge
            challenge={topChallenge}
            onComplete={() => completeChallenge(topChallenge.id)}
          />
        )}

        {/* Alertas recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Alertas Recentes
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.dangerBg }]}>
              <Text style={[styles.badgeText, { color: colors.danger }]}>
                {alerts.filter((a) => a.severity === "high").length} críticos
              </Text>
            </View>
          </View>
          <View style={styles.alertsList}>
            {alerts.slice(0, 4).map((a) => (
              <AlertItem key={a.id} alert={a} />
            ))}
          </View>
        </View>

        {/* Notícias e Dicas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Notícias e Dicas
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.newsScroll}
            contentContainerStyle={styles.newsScrollContent}
          >
            {NEWS_CARDS.map((card) => (
              <View
                key={card.id}
                style={[
                  styles.newsCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.newsTag,
                    { backgroundColor: card.color + "20" },
                  ]}
                >
                  <Text
                    style={[styles.newsTagText, { color: card.color }]}
                  >
                    {card.tag}
                  </Text>
                </View>
                <Text
                  style={[styles.newsTitle, { color: colors.foreground }]}
                  numberOfLines={3}
                >
                  {card.title}
                </Text>
                <Text
                  style={[styles.newsTime, { color: colors.mutedForeground }]}
                >
                  {card.time}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  headerApp: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  xpText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  levelText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  heroSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  mapContainer: {
    borderRadius: 14,
    overflow: "hidden",
    height: 180,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  mapBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  mapBadgeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "#F0F4F8",
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  alertsList: {
    gap: 8,
  },
  newsScroll: {
    marginHorizontal: -16,
  },
  newsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  newsCard: {
    width: 200,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  newsTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newsTagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  newsTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
  },
  newsTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
});
