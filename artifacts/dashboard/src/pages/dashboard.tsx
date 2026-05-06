import {
  useGetStats,
  useGetStatsTimeline,
  useGetStatsByType,
  useGetStatsByStatus,
  useListAlerts,
  getGetStatsQueryKey,
  getGetStatsTimelineQueryKey,
  getGetStatsByTypeQueryKey,
  getGetStatsByStatusQueryKey,
  getListAlertsQueryKey,
} from "@workspace/api-client-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Layout } from "@/components/layout";
import {
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Siren,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  enviado: "#f59e0b",
  em_análise: "#3b82f6",
  resolvido: "#10b981",
  arquivado: "#6b7280",
};

const PIE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

const SEVERITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7c3aed",
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: timeline } = useGetStatsTimeline({ query: { queryKey: getGetStatsTimelineQueryKey() } });
  const { data: byType } = useGetStatsByType({ query: { queryKey: getGetStatsByTypeQueryKey() } });
  const { data: byStatus } = useGetStatsByStatus({ query: { queryKey: getGetStatsByStatusQueryKey() } });
  const { data: alerts } = useListAlerts(
    { active: true },
    { query: { queryKey: getListAlertsQueryKey({ active: true }) } }
  );

  const chartTimeline = (timeline ?? []).map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  }));

  const chartByType = byType ?? [];
  const chartByStatus = (byStatus ?? []).map((d) => ({
    ...d,
    fill: STATUS_COLORS[d.status] ?? "#6b7280",
  }));

  return (
    <Layout>
      <div className="px-4 py-5 space-y-5">
        {/* Summary stats */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Resumo Geral
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={FileText} label="Total de Relatórios" value={stats?.totalReports ?? 0} color="bg-blue-500" />
            <StatCard icon={AlertTriangle} label="Alertas Ativos" value={stats?.activeAlerts ?? 0} color="bg-orange-500" />
            <StatCard icon={CheckCircle} label="Resolvidos" value={stats?.resolvedReports ?? 0} color="bg-emerald-500" />
            <StatCard icon={Clock} label="Pendentes" value={stats?.pendingReports ?? 0} color="bg-amber-500" />
          </div>
        </section>

        {/* This week */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="text-xs text-primary font-medium">Esta Semana</p>
            <p className="text-2xl font-bold text-primary mt-1">{stats?.reportsThisWeek ?? 0}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-primary/60" />
              <span className="text-xs text-primary/60">relatórios</span>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground">Hoje</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.reportsToday ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">relatórios</p>
          </div>
        </div>

        {/* Timeline chart */}
        {chartTimeline.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Últimos 30 Dias
            </h2>
            <div className="bg-card rounded-xl p-4 border border-border">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={chartTimeline}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#grad)" strokeWidth={2} dot={false} name="Relatórios" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* By type */}
        {chartByType.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Por Categoria
            </h2>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={chartByType} dataKey="count" nameKey="category" innerRadius={28} outerRadius={45}>
                      {chartByType.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5">
                  {chartByType.map((item, i) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="text-xs text-foreground">{item.category}</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* By status */}
        {chartByStatus.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Por Status
            </h2>
            <div className="bg-card rounded-xl p-4 border border-border">
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={chartByStatus} barSize={28}>
                  <XAxis dataKey="status" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Quantidade">
                    {chartByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Active alerts */}
        {alerts && alerts.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Alertas Ativos
            </h2>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="bg-card rounded-xl p-3 border border-border flex items-start gap-3">
                  <div
                    className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${SEVERITY_COLORS[alert.severity] ?? "#6b7280"}20` }}
                  >
                    <Siren className="w-4 h-4" style={{ color: SEVERITY_COLORS[alert.severity] ?? "#6b7280" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.address}</p>
                    <span
                      className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                      style={{
                        color: SEVERITY_COLORS[alert.severity],
                        background: `${SEVERITY_COLORS[alert.severity]}20`,
                      }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="h-2" />
      </div>
    </Layout>
  );
}
