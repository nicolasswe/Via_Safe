import { ReactNode } from "react";
import { Redirect } from "wouter";
import { getToken } from "@/lib/token";
import { Layout } from "./layout";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Redirect to="/login" />;
  }

  return <Layout>{children}</Layout>;
}
