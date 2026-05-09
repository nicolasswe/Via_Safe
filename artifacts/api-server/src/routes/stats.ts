import { Router, type IRouter } from "express";
import { eq, count, sql, and, gte } from "drizzle-orm";
import { db, reportsTable, alertsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalRow] = await db
    .select({ count: count() })
    .from(reportsTable);

  const [activeAlertsRow] = await db
    .select({ count: count() })
    .from(alertsTable)
    .where(eq(alertsTable.active, true));

  const [resolvedRow] = await db
    .select({ count: count() })
    .from(reportsTable)
    .where(eq(reportsTable.status, "resolvido"));

  const [pendingRow] = await db
    .select({ count: count() })
    .from(reportsTable)
    .where(eq(reportsTable.status, "enviado"));

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const [weekRow] = await db
    .select({ count: count() })
    .from(reportsTable)
    .where(gte(reportsTable.createdAt, weekAgo));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [todayRow] = await db
    .select({ count: count() })
    .from(reportsTable)
    .where(gte(reportsTable.createdAt, today));

  res.json({
    totalReports: totalRow.count,
    activeAlerts: activeAlertsRow.count,
    resolvedReports: resolvedRow.count,
    pendingReports: pendingRow.count,
    deathsIn2026: 0,
    reportsThisWeek: weekRow.count,
    reportsToday: todayRow.count,
  });
});

router.get("/stats/timeline", async (_req, res): Promise<void> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const rows = await db
    .select({
      date: sql<string>`DATE(created_at AT TIME ZONE 'UTC')`.as("date"),
      count: count(),
    })
    .from(reportsTable)
    .where(gte(reportsTable.createdAt, thirtyDaysAgo))
    .groupBy(sql`DATE(created_at AT TIME ZONE 'UTC')`)
    .orderBy(sql`DATE(created_at AT TIME ZONE 'UTC')`);

  res.json(rows.map((r) => ({ date: r.date, count: r.count })));
});

router.get("/stats/by-type", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      category: reportsTable.category,
      count: count(),
    })
    .from(reportsTable)
    .groupBy(reportsTable.category)
    .orderBy(sql`count(*) DESC`);

  res.json(rows.map((r) => ({ category: r.category, count: r.count })));
});

router.get("/stats/by-status", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      status: reportsTable.status,
      count: count(),
    })
    .from(reportsTable)
    .groupBy(reportsTable.status)
    .orderBy(sql`count(*) DESC`);

  res.json(rows.map((r) => ({ status: r.status, count: r.count })));
});

export default router;
