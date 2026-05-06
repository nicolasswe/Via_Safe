import { useState } from "react";
import {
  useListAlerts,
  useCreateAlert,
  useUpdateAlert,
  getListAlertsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Plus, Siren, X, ChevronDown } from "lucide-react";

const SEVERITY_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  low: { label: "Baixo", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  medium: { label: "Médio", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  high: { label: "Alto", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  critical: { label: "Crítico", bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
};

const TYPE_OPTIONS = ["Acidente", "Alagamento", "Obras", "Semáforo", "Buraco", "Outro"];

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    type: "Acidente",
    title: "",
    address: "",
    lat: "-20.5386",
    lon: "-47.4006",
    severity: "medium",
  });

  const params = showOnlyActive ? { active: true } : {};
  const { data: alerts, isLoading } = useListAlerts(params, {
    query: { queryKey: getListAlertsQueryKey(params) },
  });

  const createMutation = useCreateAlert({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
        setShowCreate(false);
        setForm({ type: "Acidente", title: "", address: "", lat: "-20.5386", lon: "-47.4006", severity: "medium" });
      },
    },
  });

  const updateMutation = useUpdateAlert({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
      },
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        type: form.type,
        title: form.title,
        address: form.address,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
        severity: form.severity,
      },
    });
  };

  const toggleActive = (id: number, current: boolean) => {
    updateMutation.mutate({ id, data: { active: !current } });
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowOnlyActive((v) => !v)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
              showOnlyActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border"
            }`}
          >
            {showOnlyActive ? "Somente ativos" : "Todos os alertas"}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo alerta
          </button>
        </div>

        {/* Create form sheet */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/50">
            <div className="w-full max-w-md mx-auto bg-background rounded-t-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Novo Alerta</h3>
                <button onClick={() => setShowCreate(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Tipo</label>
                  <div className="relative mt-1">
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Título</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Ex: Acidente com vítimas na Av. Brasil"
                    className="mt-1 w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Endereço</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Rua, número - Franca, SP"
                    className="mt-1 w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Latitude</label>
                    <input
                      value={form.lat}
                      onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                      className="mt-1 w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Longitude</label>
                    <input
                      value={form.lon}
                      onChange={(e) => setForm((f) => ({ ...f, lon: e.target.value }))}
                      className="mt-1 w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Severidade</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setForm((f) => ({ ...f, severity: key }))}
                        className={`text-xs py-1.5 rounded-lg font-medium transition ${
                          form.severity === key ? `${cfg.bg} ${cfg.text}` : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-60"
                >
                  {createMutation.isPending ? "Criando..." : "Criar Alerta"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {alerts ? `${alerts.length} alerta(s)` : "Carregando..."}
        </p>

        {/* Alert list */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse">
                <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {(alerts ?? []).map((alert) => {
              const sev = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.medium;
              return (
                <div key={alert.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${sev.bg}`}>
                      <Siren className={`w-4.5 h-4.5 ${sev.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground leading-tight truncate">
                          {alert.title}
                        </p>
                        <button
                          onClick={() => toggleActive(alert.id, alert.active)}
                          disabled={updateMutation.isPending}
                          className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full transition ${
                            alert.active
                              ? "bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-700"
                              : "bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-700"
                          }`}
                        >
                          {alert.active ? "ATIVO" : "INATIVO"}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{alert.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-muted-foreground">{alert.type}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                          {sev.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
