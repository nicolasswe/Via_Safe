import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, alertsTable } from "@workspace/db";
import {
  CreateAlertBody,
  UpdateAlertBody,
  UpdateAlertParams,
  ListAlertsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeAlert(a: typeof alertsTable.$inferSelect) {
  return {
    id: a.id,
    type: a.type,
    title: a.title,
    address: a.address,
    lat: a.lat,
    lon: a.lon,
    severity: a.severity,
    active: a.active,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

router.get("/alerts", async (req, res): Promise<void> => {
  const params = ListAlertsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { active } = params.data;

  const rows = await db
    .select()
    .from(alertsTable)
    .where(active != null ? eq(alertsTable.active, active) : undefined)
    .orderBy(desc(alertsTable.createdAt));

  res.json(rows.map(serializeAlert));
});

router.post("/alerts", async (req, res): Promise<void> => {
  const parsed = CreateAlertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [alert] = await db
    .insert(alertsTable)
    .values({
      type: parsed.data.type,
      title: parsed.data.title,
      address: parsed.data.address,
      lat: parsed.data.lat,
      lon: parsed.data.lon,
      severity: parsed.data.severity ?? "medium",
    })
    .returning();

  res.status(201).json(serializeAlert(alert));
});

router.patch("/alerts/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateAlertParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAlertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<typeof alertsTable.$inferInsert> = {};
  if (parsed.data.active != null) updates.active = parsed.data.active;
  if (parsed.data.severity != null) updates.severity = parsed.data.severity;

  if (Object.keys(updates).length === 0) {
    const [existing] = await db
      .select()
      .from(alertsTable)
      .where(eq(alertsTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }
    res.json(serializeAlert(existing));
    return;
  }

  const [alert] = await db
    .update(alertsTable)
    .set({ ...updates, updatedAt: sql`NOW()` })
    .where(eq(alertsTable.id, params.data.id))
    .returning();

  if (!alert) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }

  res.json(serializeAlert(alert));
});

export default router;
