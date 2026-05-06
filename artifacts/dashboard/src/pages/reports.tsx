import { useState } from "react";
import {
  useListReports,
  useUpdateReport,
  getListReportsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { ChevronDown, Filter } from "lucide-react";

const STATUS_OPTIONS = ["", "enviado", "em_análise", "resolvido", "arquivado"];
const CATEGORY_OPTIONS = ["", "Acidente", "Buraco", "Semáforo", "Obras", "Alagamento", "Outro"];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  enviado: { bg: "bg-amber-100", text: "text-amber-700", label: "Enviado" },
  em_análise: { bg: "bg-blue-100", text: "text-blue-700", label: "Em Análise" },
  resolvido: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Resolvido" },
  arquivado: { bg: "bg-gray-100", text: "text-gray-600", label: "Arquivado" },
};

export default function ReportsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const params = {
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    limit: 50,
  };

  const { data: reports, isLoading } = useListReports(params, {
    query: { queryKey: getListReportsQueryKey(params) },
  });

  const updateMutation = useUpdateReport({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
      },
    },
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Filter className="w-3 h-3" />
            Filtros
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s ? STATUS_COLORS[s]?.label ?? s : "Todos os status"}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c || "Todas as categorias"}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {reports ? `${reports.length} relatório(s)` : "Carregando..."}
        </p>

        {/* List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse">
                <div className="h-3 bg-muted rounded w-2/3 mb-2" />
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {(reports ?? []).map((report) => {
              const st = STATUS_COLORS[report.status];
              const isExpanded = expandedId === report.id;
              return (
                <div key={report.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : report.id)}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-primary">{report.category}</span>
                          {st && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                              {st.label}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground mt-1 leading-snug line-clamp-2">
                          {report.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{report.location}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Protocolo</span>
                          <p className="font-mono font-medium text-foreground">{report.protocol}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data</span>
                          <p className="font-medium text-foreground">
                            {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Atualizar status</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {STATUS_OPTIONS.filter(Boolean).map((s) => {
                            const info = STATUS_COLORS[s];
                            const isActive = report.status === s;
                            return (
                              <button
                                key={s}
                                disabled={isActive || updateMutation.isPending}
                                onClick={() => handleStatusChange(report.id, s)}
                                className={`text-xs py-1.5 px-2 rounded-lg font-medium transition ${
                                  isActive
                                    ? `${info?.bg} ${info?.text} opacity-100`
                                    : "bg-muted text-muted-foreground hover:bg-secondary"
                                } disabled:opacity-50`}
                              >
                                {info?.label ?? s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
