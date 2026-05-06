import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BadgeCard } from "@/components/BadgeCard";
import { LearningCard } from "@/components/LearningCard";
import { QuizModal } from "@/components/QuizModal";
import { useApp, LearningModule } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AprenderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { badges, modules, ranking, xp, level, completeLesson } = useApp();
  const [quizModule, setQuizModule] = useState<LearningModule | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const totalXpForLevel = (level + 1) * 250;
  const levelProgress = (xp % 250) / 250;

  const rankColors: string[] = [
    colors.rank1,
    colors.rank2,
    colors.rank3,
  ];

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
          Aprender
        </Text>

        {/* Level Card */}
        <View
          style={[styles.levelCard, { backgroundColor: colors.navy }]}
        >
          <View style={styles.levelLeft}>
            <View style={[styles.levelBadge, { backgroundColor: colors.primary + "30" }]}>
              <Feather name="trending-up" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.levelText, { color: "#F0F4F8" }]}>
                Nível {level} · {xp} XP
              </Text>
              <Text style={[styles.levelSub, { color: "#8899A6" }]}>
                {totalXpForLevel - (xp % 250)} XP para o próximo nível
              </Text>
            </View>
          </View>
          <View style={styles.badgeCount}>
            <Feather name="award" size={14} color={colors.warning} />
            <Text style={[styles.badgeCountText, { color: colors.warning }]}>
              {unlockedBadges}/{badges.length}
            </Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={[styles.progressTrack, { backgroundColor: colors.navyBorder }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${levelProgress * 100}%` as any,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomInset + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Trilhas de Aprendizagem */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="book-open" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Trilhas de Aprendizagem
            </Text>
          </View>
          <View style={styles.modulesList}>
            {modules.map((module) => (
              <LearningCard
                key={module.id}
                module={module}
                onPress={() => setQuizModule(module)}
              />
            ))}
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={18} color={colors.warning} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Conquistas
            </Text>
            <Text
              style={[styles.badgeProgress, { color: colors.mutedForeground }]}
            >
              {unlockedBadges}/{badges.length} desbloqueadas
            </Text>
          </View>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>
        </View>

        {/* Ranking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="bar-chart-2" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Ranking da Comunidade
            </Text>
          </View>
          <View style={[styles.rankCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {ranking.map((user, idx) => {
              const isMe = user.name === "Você";
              return (
                <View key={user.name}>
                  <View
                    style={[
                      styles.rankRow,
                      isMe && { backgroundColor: colors.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankPosition,
                        {
                          color: idx < 3 ? rankColors[idx] : colors.mutedForeground,
                          fontFamily:
                            idx < 3 ? "Inter_700Bold" : "Inter_400Regular",
                        },
                      ]}
                    >
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`}
                    </Text>
                    <View
                      style={[
                        styles.avatar,
                        {
                          backgroundColor: isMe ? colors.primary : colors.secondary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          { color: isMe ? "#fff" : colors.foreground },
                        ]}
                      >
                        {user.avatar}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.rankName,
                        {
                          color: colors.foreground,
                          fontFamily: isMe ? "Inter_700Bold" : "Inter_500Medium",
                        },
                      ]}
                    >
                      {user.name}
                      {isMe && " (Você)"}
                    </Text>
                    <Text
                      style={[styles.rankScore, { color: colors.primary }]}
                    >
                      {user.score} XP
                    </Text>
                  </View>
                  {idx < ranking.length - 1 && (
                    <View
                      style={[styles.divider, { backgroundColor: colors.border }]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Vozes do Trânsito */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="mic" size={18} color={colors.danger} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Vozes do Trânsito
            </Text>
          </View>
          <View
            style={[
              styles.quoteCard,
              { backgroundColor: colors.dangerBg, borderColor: colors.danger },
            ]}
          >
            <Feather name="quote" size={20} color={colors.danger} />
            <Text style={[styles.quoteText, { color: colors.foreground }]}>
              "Não vejo muitas campanhas, não vejo que é um assunto tratado com
              seriedade e prioridade que deveria ser falado."
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.mutedForeground }]}>
              — Rafael Felício de Sousa, médico psicotécnico
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.danger }]}>
                  18
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  mortes em{"\n"}2026*
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>
                  92%
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  vítimas{"\n"}masculinas
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  90%
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  falha{"\n"}humana
                </Text>
              </View>
            </View>
            <Text style={[styles.statNote, { color: colors.mutedForeground }]}>
              *até março de 2026 · Fonte: Infosiga SP
            </Text>
          </View>
        </View>
      </ScrollView>

      <QuizModal
        visible={quizModule !== null}
        module={quizModule}
        onClose={() => setQuizModule(null)}
        onComplete={() => {
          if (quizModule) completeLesson(quizModule.id);
          setQuizModule(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  levelCard: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  levelSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  badgeCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeCountText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    flex: 1,
  },
  badgeProgress: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  modulesList: {
    gap: 12,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  rankCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rankPosition: {
    fontSize: 16,
    width: 28,
    textAlign: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  rankName: {
    fontSize: 14,
    flex: 1,
  },
  rankScore: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
  quoteCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  quoteText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  statCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  stat: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
  statDivider: {
    width: 1,
    height: 50,
  },
  statNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "center",
  },
});
