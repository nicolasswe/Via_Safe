import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ReportCategory =
  | "acidente"
  | "buraco"
  | "semaforo"
  | "sinalizacao"
  | "fio_solto"
  | "imprudente";

export type ReportStatus = "enviado" | "em_analise" | "resolvido";

export interface Report {
  id: string;
  category: ReportCategory;
  description: string;
  location: string;
  status: ReportStatus;
  createdAt: string;
  protocol: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  xpReward: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface Alert {
  id: string;
  type: "acidente" | "buraco" | "semaforo" | "fio_solto" | "lento" | "obra";
  title: string;
  address: string;
  time: string;
  severity: "high" | "medium" | "low";
  lat: number;
  lon: number;
}

interface AppState {
  safetyScore: number;
  xp: number;
  level: number;
  reports: Report[];
  badges: Badge[];
  modules: LearningModule[];
  challenges: Challenge[];
  alerts: Alert[];
  ranking: { name: string; score: number; avatar: string }[];
  addReport: (report: Omit<Report, "id" | "protocol" | "createdAt">) => void;
  completeChallenge: (id: string) => void;
  completeLesson: (moduleId: string) => void;
}

const defaultAlerts: Alert[] = [
  {
    id: "1",
    type: "acidente",
    title: "Acidente com moto",
    address: "Av. Major Nicácio, 1200",
    time: "há 12 min",
    severity: "high",
    lat: -20.537,
    lon: -47.4025,
  },
  {
    id: "2",
    type: "buraco",
    title: "Buraco na via",
    address: "Av. Ademar P. de Barros, 450",
    time: "há 34 min",
    severity: "medium",
    lat: -20.5405,
    lon: -47.3987,
  },
  {
    id: "3",
    type: "semaforo",
    title: "Semáforo quebrado",
    address: "R. Frederico Moura c/ R. XV de Nov.",
    time: "há 1h",
    severity: "medium",
    lat: -20.538,
    lon: -47.401,
  },
  {
    id: "4",
    type: "fio_solto",
    title: "Fio solto na via",
    address: "R. Santos Dumont, 320",
    time: "há 2h",
    severity: "high",
    lat: -20.536,
    lon: -47.3995,
  },
  {
    id: "5",
    type: "lento",
    title: "Trânsito lento",
    address: "Av. Major Nicácio, sentido centro",
    time: "há 5 min",
    severity: "low",
    lat: -20.5395,
    lon: -47.404,
  },
];

const defaultBadges: Badge[] = [
  {
    id: "b1",
    title: "Condutor Consciente",
    description: "Complete seu primeiro módulo de aprendizagem",
    icon: "shield",
    unlocked: true,
    unlockedAt: "2026-04-01",
  },
  {
    id: "b2",
    title: "Guardião da Cidade",
    description: "Faça seu primeiro reporte comunitário",
    icon: "users",
    unlocked: false,
  },
  {
    id: "b3",
    title: "Semana Segura",
    description: "Mantenha pontuação acima de 70 por 7 dias",
    icon: "award",
    unlocked: false,
  },
  {
    id: "b4",
    title: "Mestre da Defensiva",
    description: "Complete a trilha de Direção Defensiva",
    icon: "trending-up",
    unlocked: false,
  },
  {
    id: "b5",
    title: "Amigo do Pedestre",
    description: "Complete o módulo Respeito ao Pedestre",
    icon: "user-check",
    unlocked: false,
  },
  {
    id: "b6",
    title: "Motociclista Seguro",
    description: "Complete o módulo de Segurança para Motociclistas",
    icon: "zap",
    unlocked: false,
  },
];

const defaultModules: LearningModule[] = [
  {
    id: "m1",
    title: "Direção Defensiva",
    description: "Técnicas para antecipar perigos e evitar acidentes",
    icon: "shield",
    color: "#3B82F6",
    totalLessons: 5,
    completedLessons: 2,
    xpReward: 150,
  },
  {
    id: "m2",
    title: "Respeito ao Pedestre",
    description: "Como compartilhar o espaço urbano com segurança",
    icon: "user-check",
    color: "#22C55E",
    totalLessons: 4,
    completedLessons: 0,
    xpReward: 120,
  },
  {
    id: "m3",
    title: "Segurança para Motociclistas",
    description: "Proteja-se nas vias de Franca",
    icon: "zap",
    color: "#F59E0B",
    totalLessons: 6,
    completedLessons: 0,
    xpReward: 180,
  },
];

const defaultChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Distância Segura",
    description:
      'Mantenha 2 segundos de distância do veículo à frente durante toda a viagem de hoje',
    xpReward: 50,
    completed: false,
  },
  {
    id: "c2",
    title: "Faixa de Pedestres",
    description: "Pare completamente antes de cada faixa de pedestres",
    xpReward: 40,
    completed: true,
  },
];

const defaultRanking = [
  { name: "Maria S.", score: 940, avatar: "M" },
  { name: "Carlos A.", score: 890, avatar: "C" },
  { name: "Você", score: 820, avatar: "V" },
  { name: "João P.", score: 780, avatar: "J" },
  { name: "Ana L.", score: 750, avatar: "A" },
];

const AppContext = createContext<AppState>({} as AppState);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [safetyScore] = useState(78);
  const [xp, setXp] = useState(820);
  const [level] = useState(4);
  const [reports, setReports] = useState<Report[]>([
    {
      id: "r1",
      category: "buraco",
      description: "Buraco grande na via",
      location: "Av. Major Nicácio",
      status: "em_analise",
      createdAt: "2026-05-03",
      protocol: "FR-2026-001",
    },
  ]);
  const [badges] = useState<Badge[]>(defaultBadges);
  const [modules, setModules] = useState<LearningModule[]>(defaultModules);
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges);
  const [alerts] = useState<Alert[]>(defaultAlerts);
  const [ranking] = useState(defaultRanking);

  useEffect(() => {
    AsyncStorage.getItem("viasafe_data").then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.xp) setXp(parsed.xp);
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("viasafe_data", JSON.stringify({ xp }));
  }, [xp]);

  const addReport = useCallback(
    (report: Omit<Report, "id" | "protocol" | "createdAt">) => {
      const newReport: Report = {
        ...report,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        protocol: `FR-2026-${String(reports.length + 2).padStart(3, "0")}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setReports((prev) => [newReport, ...prev]);
      setXp((prev) => prev + 30);
    },
    [reports.length]
  );

  const completeChallenge = useCallback((id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: true } : c))
    );
    setXp((prev) => prev + 50);
  }, []);

  const completeLesson = useCallback((moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId && m.completedLessons < m.totalLessons
          ? { ...m, completedLessons: m.completedLessons + 1 }
          : m
      )
    );
    setXp((prev) => prev + 30);
  }, []);

  return (
    <AppContext.Provider
      value={{
        safetyScore,
        xp,
        level,
        reports,
        badges,
        modules,
        challenges,
        alerts,
        ranking,
        addReport,
        completeChallenge,
        completeLesson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
