
// Added missing Cloudflare D1 and Pages types to fix compilation errors
interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(colName?: string): Promise<T | null>;
  all<T = any>(): Promise<{ results: T[] }>;
  run(): Promise<any>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  waitUntil: (promise: Promise<any>) => void;
}) => Response | Promise<Response>;

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const entry = await request.json() as any;

  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO entries (id, cultivation_id, date, category, type, amount, quantity, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      entry.id,
      entry.cultivationId,
      entry.date,
      entry.category,
      entry.type,
      entry.amount,
      entry.quantity || null,
      entry.description
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};