import { Router, type IRouter } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db, reportsTable } from "@workspace/db";
import {
  CreateReportBody,
  UpdateReportBody,
  UpdateReportParams,
  ListReportsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeReport(r: typeof reportsTable.$inferSelect) {
  return {
    id: r.id,
    userId: r.userId ?? null,
    category: r.category,
    description: r.description,
    location: r.location,
    lat: r.lat ?? null,
    lon: r.lon ?? null,
    status: r.status,
    protocol: r.protocol,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

router.get("/reports", async (req, res): Promise<void> => {
  const params = ListReportsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, category, limit } = params.data;

  const conditions = [];
  if (status) conditions.push(eq(reportsTable.status, status));
  if (category) conditions.push(eq(reportsTable.category, category));

  const query = db
    .select()
    .from(reportsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(reportsTable.createdAt));

  const rows = limit ? await query.limit(limit) : await query;

  res.json(rows.map(serializeReport));
});

router.post("/reports", async (req, res): Promise<void> => {
  const parsed = CreateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [report] = await db
    .insert(reportsTable)
    .values({
      userId: parsed.data.userId ?? null,
      category: parsed.data.category,
      description: parsed.data.description,
      location: parsed.data.location,
      lat: parsed.data.lat ?? null,
      lon: parsed.data.lon ?? null,
      protocol: parsed.data.protocol,
    })
    .returning();

  res.status(201).json(serializeReport(report));
});

router.patch("/reports/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateReportParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Partial<typeof reportsTable.$inferInsert> = {};
  if (parsed.data.status != null) updates.status = parsed.data.status;

  if (Object.keys(updates).length === 0) {
    const [existing] = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Report not found" });
      return;
    }
    res.json(serializeReport(existing));
    return;
  }

  const [report] = await db
    .update(reportsTable)
    .set({ ...updates, updatedAt: sql`NOW()` })
    .where(eq(reportsTable.id, params.data.id))
    .returning();

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json(serializeReport(report));
});

export default router;
