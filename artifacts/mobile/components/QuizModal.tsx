import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { LearningModule } from "@/context/AppContext";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Record<string, Question[]> = {
  m1: [
    {
      question: "Qual é a distância mínima recomendada do veículo à frente?",
      options: ["1 segundo", "2 segundos", "30 cm", "5 metros"],
      correct: 1,
      explanation:
        "A regra dos 2 segundos garante tempo suficiente para frear em caso de emergência.",
    },
    {
      question: "O que é direção defensiva?",
      options: [
        "Dirigir devagar sempre",
        "Antecipar perigos e agir preventivamente",
        "Usar o freio constantemente",
        "Evitar ultrapassagens",
      ],
      correct: 1,
      explanation:
        "Direção defensiva é antecipar possíveis riscos e agir antes que o perigo se concretize.",
    },
  ],
  m2: [
    {
      question:
        "Qual é a velocidade máxima ao passar por uma faixa de pedestres?",
      options: ["40 km/h", "30 km/h", "Velocidade da via", "20 km/h"],
      correct: 1,
      explanation:
        "Em faixas de pedestres, o condutor deve reduzir para 30 km/h e ceder passagem.",
    },
  ],
  m3: [
    {
      question: "Qual equipamento é obrigatório para motociclistas?",
      options: [
        "Somente o capacete",
        "Capacete, luvas e jaqueta",
        "Capacete com viseira, luvas, jaqueta e calçado fechado",
        "Apenas colete",
      ],
      correct: 2,
      explanation:
        "O conjunto completo de EPIs reduz drasticamente o risco de lesões graves.",
    },
  ],
};

interface Props {
  visible: boolean;
  module: LearningModule | null;
  onClose: () => void;
  onComplete: () => void;
}

export function QuizModal({ visible, module, onClose, onComplete }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!module) return null;

  const questions = QUESTIONS[module.id] || QUESTIONS.m1;
  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.correct) {
      setScore((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete();
    }
  };

  const handleClose = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top + 16 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.moduleInfo}>
            <Text style={[styles.moduleTitle, { color: colors.mutedForeground }]}>
              {module.title}
            </Text>
            {!finished && (
              <Text style={[styles.progress, { color: colors.foreground }]}>
                {currentQ + 1}/{questions.length}
              </Text>
            )}
          </View>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        {!finished ? (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.progressBar,
                { backgroundColor: colors.muted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${((currentQ) / questions.length) * 100}%` as any,
                  },
                ]}
              />
            </View>

            <Text style={[styles.questionText, { color: colors.foreground }]}>
              {question.question}
            </Text>

            {question.options.map((opt, idx) => {
              let bg = colors.card;
              let border = colors.border;
              let textColor = colors.foreground;

              if (selected !== null) {
                if (idx === question.correct) {
                  bg = colors.safeBg;
                  border = colors.safe;
                  textColor = colors.safe;
                } else if (idx === selected && idx !== question.correct) {
                  bg = colors.dangerBg;
                  border = colors.danger;
                  textColor = colors.danger;
                }
              }

              return (
                <Pressable
                  key={idx}
                  onPress={() => handleSelect(idx)}
                  style={[
                    styles.option,
                    { backgroundColor: bg, borderColor: border },
                  ]}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {opt}
                  </Text>
                  {selected !== null && idx === question.correct && (
                    <Feather name="check" size={16} color={colors.safe} />
                  )}
                  {selected === idx && idx !== question.correct && (
                    <Feather name="x" size={16} color={colors.danger} />
                  )}
                </Pressable>
              );
            })}

            {showResult && (
              <View
                style={[
                  styles.explanation,
                  { backgroundColor: colors.accent, borderColor: colors.primary },
                ]}
              >
                <Feather name="info" size={16} color={colors.primary} />
                <Text style={[styles.explanationText, { color: colors.foreground }]}>
                  {question.explanation}
                </Text>
              </View>
            )}

            {showResult && (
              <Pressable
                onPress={handleNext}
                style={[styles.nextBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.nextText}>
                  {currentQ + 1 < questions.length ? "Próxima" : "Finalizar"}
                </Text>
                <Feather name="arrow-right" size={16} color="#fff" />
              </Pressable>
            )}
          </ScrollView>
        ) : (
          <View style={styles.finishedContent}>
            <View
              style={[styles.finishedIcon, { backgroundColor: colors.safeBg }]}
            >
              <Feather name="award" size={48} color={colors.safe} />
            </View>
            <Text style={[styles.finishedTitle, { color: colors.foreground }]}>
              Aula Concluída!
            </Text>
            <Text
              style={[styles.finishedScore, { color: colors.mutedForeground }]}
            >
              Você acertou {score} de {questions.length} questões
            </Text>
            <Text style={[styles.xpEarned, { color: colors.warning }]}>
              +30 XP ganhos
            </Text>
            <Pressable
              onPress={handleClose}
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.doneBtnText}>Continuar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  moduleInfo: {
    gap: 2,
  },
  moduleTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  progress: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 60,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  questionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  optionText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    flex: 1,
  },
  explanation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  explanationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  nextText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
  finishedContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 14,
  },
  finishedIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  finishedTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
  },
  finishedScore: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  xpEarned: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  doneBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  doneBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
