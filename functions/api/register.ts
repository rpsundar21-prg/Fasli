// --- FIX: Add these Type Definitions at the top ---
interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  run(): Promise<any>;
  all(): Promise<any>;
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
// --------------------------------------------------

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { 
      name, mobile, password, region_id, location_id, 
      cascade_id, village_id, membership_type, joint_year 
    } = body;

    // Generate a random ID
    const newId = crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO farmers (
        id, name, mobile, password, region_id, location_id, 
        cascade_id, village_id, membership_type, joint_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId, name, mobile, password, region_id, location_id, 
      cascade_id, village_id, membership_type, joint_year
    ).run();

    return new Response(JSON.stringify({ success: true, id: newId }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};