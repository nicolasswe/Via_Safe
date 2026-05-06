import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message ?? "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const topInset = Platform.OS === "web" ? 0 : insets.top;
  const bottomInset = Platform.OS === "web" ? 0 : insets.bottom;

  return (
    <View style={[styles.screen, { backgroundColor: colors.navy }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: topInset + 24, paddingBottom: bottomInset + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back + Logo */}
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backBtn,
                {
                  backgroundColor: colors.navyCard,
                  borderColor: colors.navyBorder,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather name="arrow-left" size={18} color={colors.foreground} />
            </Pressable>
          </View>

          <View style={styles.logoBlock}>
            <View
              style={[styles.logoIcon, { backgroundColor: colors.navyCard }]}
            >
              <Feather name="shield" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.appName, { color: colors.primary }]}>
              ViaSafe
            </Text>
            <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
              Crie sua conta gratuitamente
            </Text>
          </View>

          {/* Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.navyCard,
                borderColor: colors.navyBorder,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Criar Conta
            </Text>

            {error ? (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: "#2D000020", borderColor: "#EF444440" },
                ]}
              >
                <Feather name="alert-circle" size={14} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Nome */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Nome completo
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.navy, borderColor: colors.navyBorder },
                ]}
              >
                <Feather
                  name="user"
                  size={16}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Seu nome"
                  placeholderTextColor={colors.mutedForeground}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Email
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.navy, borderColor: colors.navyBorder },
                ]}
              >
                <Feather
                  name="mail"
                  size={16}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Senha */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Senha
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.navy, borderColor: colors.navyBorder },
                ]}
              >
                <Feather
                  name="lock"
                  size={16}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Mín. 6 caracteres"
                  placeholderTextColor={colors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={16}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirmar senha */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Confirmar senha
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.navy, borderColor: colors.navyBorder },
                ]}
              >
                <Feather
                  name="lock"
                  size={16}
                  color={colors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Repita a senha"
                  placeholderTextColor={colors.mutedForeground}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {/* Benefícios */}
            <View
              style={[
                styles.benefitsBox,
                { backgroundColor: "#FF6B2C15", borderColor: "#FF6B2C30" },
              ]}
            >
              {[
                "Reporte ocorrências no trânsito",
                "Ganhe XP e suba de nível",
                "Acesse rotas seguras em Franca",
              ].map((b) => (
                <View key={b} style={styles.benefitRow}>
                  <Feather name="check-circle" size={13} color={colors.primary} />
                  <Text
                    style={[styles.benefitText, { color: colors.mutedForeground }]}
                  >
                    {b}
                  </Text>
                </View>
              ))}
            </View>

            {/* Botão */}
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.btnText}>Criar Conta</Text>
              )}
            </Pressable>
          </View>

          {/* Link login */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Já tem conta?{" "}
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Entrar
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: 24,
    gap: 6,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  appName: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
  },
  appSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 2,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    flex: 1,
  },
  field: { gap: 6 },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },
  benefitsBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  btn: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  btnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  footerLink: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
});
