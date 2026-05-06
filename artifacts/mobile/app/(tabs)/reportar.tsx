import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CATEGORY_CONFIG,
  ReportCategoryBtn,
} from "@/components/ReportCategoryBtn";
import { useApp, Report, ReportCategory } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const STATUS_CONFIG: Record<
  Report["status"],
  { label: string; color: string; bgKey: string }
> = {
  enviado: { label: "Enviado", color: "#3B82F6", bgKey: "blue" },
  em_analise: { label: "Em Análise", color: "#F59E0B", bgKey: "yellow" },
  resolvido: { label: "Resolvido", color: "#22C55E", bgKey: "green" },
};

export default function ReportarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reports, addReport } = useApp();
  const [activeTab, setActiveTab] = useState<"novo" | "meus">("novo");
  const [selectedCategory, setSelectedCategory] =
    useState<ReportCategory | null>(null);
  const [description, setDescription] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [protocol, setProtocol] = useState("");

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert("Atenção", "Selecione uma categoria para continuar.");
      return;
    }
    const newProtocol = `FR-2026-${String(reports.length + 2).padStart(3, "0")}`;
    setProtocol(newProtocol);
    addReport({
      category: selectedCategory,
      description: description || "Sem descrição adicional",
      location: "Franca, SP",
      status: "enviado",
    });
    setSelectedCategory(null);
    setDescription("");
    setSuccessModal(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const categories: ReportCategory[] = [
    "acidente",
    "buraco",
    "semaforo",
    "sinalizacao",
    "fio_solto",
    "imprudente",
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
          Reporte Comunitário
        </Text>
        <View style={styles.tabBar}>
          <Pressable
            onPress={() => setActiveTab("novo")}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === "novo" ? colors.primary : "transparent",
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "novo" ? "#fff" : colors.mutedForeground,
                },
              ]}
            >
              Novo Reporte
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("meus")}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === "meus" ? colors.primary : "transparent",
              },
            ]}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "meus" ? "#fff" : colors.mutedForeground,
                  },
                ]}
              >
                Meus Reportes
              </Text>
              {reports.length > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor:
                        activeTab === "meus" ? "rgba(255,255,255,0.3)" : colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.countText}>{reports.length}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      {activeTab === "novo" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: bottomInset + 100 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Location */}
            <View
              style={[
                styles.locationBar,
                { backgroundColor: colors.accent, borderColor: colors.primary },
              ]}
            >
              <Feather name="map-pin" size={16} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.foreground }]}>
                Franca, SP · Localização detectada
              </Text>
              <Feather name="check-circle" size={14} color={colors.safe} />
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
                O que você quer reportar?
              </Text>
              <View style={styles.categoriesGrid}>
                {categories.map((cat, i) => (
                  <ReportCategoryBtn
                    key={cat}
                    category={cat}
                    selected={selectedCategory === cat}
                    onSelect={() => setSelectedCategory(cat)}
                  />
                ))}
              </View>
            </View>

            {/* Photo */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
                Adicionar foto (opcional)
              </Text>
              <Pressable
                style={[
                  styles.photoBtn,
                  { backgroundColor: colors.muted, borderColor: colors.border },
                ]}
              >
                <Feather name="camera" size={28} color={colors.mutedForeground} />
                <Text
                  style={[
                    styles.photoBtnText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Tirar foto ou vídeo
                </Text>
                <Text
                  style={[
                    styles.photoBtnSub,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Ajuda a identificar o problema mais rapidamente
                </Text>
              </Pressable>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
                Descrição adicional (opcional)
              </Text>
              <TextInput
                style={[
                  styles.descriptionInput,
                  {
                    backgroundColor: colors.muted,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Descreva o problema com mais detalhes..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>

            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                {
                  backgroundColor: selectedCategory
                    ? pressed
                      ? colors.primary + "CC"
                      : colors.primary
                    : colors.muted,
                },
              ]}
            >
              <Feather
                name="send"
                size={16}
                color={selectedCategory ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.submitText,
                  {
                    color: selectedCategory
                      ? "#fff"
                      : colors.mutedForeground,
                  },
                ]}
              >
                Enviar Reporte
              </Text>
            </Pressable>

            <Text
              style={[styles.anonymousNote, { color: colors.mutedForeground }]}
            >
              Reportes de "Motorista Imprudente" podem ser feitos anonimamente
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomInset + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Nenhum reporte ainda
              </Text>
              <Text
                style={[styles.emptyText, { color: colors.mutedForeground }]}
              >
                Ajude a comunidade reportando problemas no trânsito de Franca
              </Text>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {reports.map((report) => {
                const status = STATUS_CONFIG[report.status];
                const catConfig = CATEGORY_CONFIG[report.category];
                return (
                  <View
                    key={report.id}
                    style={[
                      styles.reportCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.reportCardHeader}>
                      <View
                        style={[
                          styles.catIcon,
                          { backgroundColor: catConfig.color + "20" },
                        ]}
                      >
                        <Feather
                          name={catConfig.icon}
                          size={18}
                          color={catConfig.color}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.reportTitle,
                            { color: colors.foreground },
                          ]}
                        >
                          {catConfig.label}
                        </Text>
                        <Text
                          style={[
                            styles.reportLocation,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {report.location}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: status.color + "20" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: status.color },
                          ]}
                        >
                          {status.label}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[styles.divider, { backgroundColor: colors.border }]}
                    />
                    <View style={styles.reportMeta}>
                      <Text
                        style={[
                          styles.protocol,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        Protocolo: {report.protocol}
                      </Text>
                      <Text
                        style={[styles.date, { color: colors.mutedForeground }]}
                      >
                        {report.createdAt}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* Success Modal */}
      <Modal
        visible={successModal}
        animationType="fade"
        transparent
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={[styles.successIcon, { backgroundColor: colors.safeBg }]}>
              <Feather name="check" size={36} color={colors.safe} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Reporte Enviado!
            </Text>
            <Text
              style={[styles.modalText, { color: colors.mutedForeground }]}
            >
              Obrigado por ajudar a deixar Franca mais segura. Seu reporte foi
              registrado com o protocolo:
            </Text>
            <View
              style={[
                styles.protocolBox,
                { backgroundColor: colors.muted },
              ]}
            >
              <Text
                style={[styles.protocolText, { color: colors.primary }]}
              >
                {protocol}
              </Text>
            </View>
            <Text
              style={[styles.xpNote, { color: colors.warning }]}
            >
              +30 XP ganhos!
            </Text>
            <Pressable
              onPress={() => {
                setSuccessModal(false);
                setActiveTab("meus");
              }}
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.modalBtnText}>Ver meus reportes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  countBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#fff",
  },
  content: {
    padding: 16,
    gap: 18,
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    flex: 1,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photoBtn: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  photoBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  photoBtnSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
  },
  descriptionInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    minHeight: 100,
    lineHeight: 20,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
  },
  submitText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  anonymousNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  reportCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  reportTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  reportLocation: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  divider: {
    height: 1,
  },
  reportMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  protocol: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 340,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  modalText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  protocolBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  protocolText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  xpNote: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  modalBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 32,
    marginTop: 4,
  },
  modalBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
