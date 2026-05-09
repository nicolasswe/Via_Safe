import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLogin } from "@workspace/api-client-react";
import { setToken } from "@/lib/token";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("admin@viasafe.com.br");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess(data) {
        setToken(data.token);
        setLocation("/");
      },
      onError(err: unknown) {
        const e = err as { data?: { error?: string } };
        setError(e?.data?.error ?? "Credenciais inválidas");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0F1923" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo block */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "#1A2738" }}
          >
            <ShieldCheck className="w-8 h-8" style={{ color: "#FF6B2C" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#FF6B2C" }}>
            ViaSafe
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8899A6" }}>
            Painel de Segurança Viária · Franca, SP
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: "#1A2738", border: "1px solid #253347" }}
        >
          <h2 className="text-base font-semibold text-center" style={{ color: "#F0F4F8" }}>
            Entrar
          </h2>

          {error && (
            <div
              className="rounded-lg px-3 py-2 text-sm text-center"
              style={{ backgroundColor: "#2D0000", color: "#EF4444", border: "1px solid #EF444430" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8899A6" }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#637080" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{
                    backgroundColor: "#253347",
                    border: "1px solid #253347",
                    color: "#F0F4F8",
                  }}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8899A6" }}>
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#637080" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{
                    backgroundColor: "#253347",
                    border: "1px solid #253347",
                    color: "#F0F4F8",
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "#637080" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: "#FF6B2C", color: "#FFFFFF" }}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#637080" }}>
          Prefeitura de Franca — SP
        </p>
      </div>
    </div>
  );
}
