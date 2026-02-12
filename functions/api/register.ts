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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // 1. Get the data sent from the App
    const body = await request.json() as any;

    // 2. Destructure the fields
    const {
      id, 
      name, 
      mobile, 
      region_id, 
      location_id, 
      cascade_id, 
      village_id, 
      primary_crop, 
      membership_type, 
      joint_year
    } = body;

    // 3. Insert into Database
    // We use crypto.randomUUID() to generate an ID if the app didn't send one
    const newId = id || crypto.randomUUID();

    const info = await env.DB.prepare(`
      INSERT INTO farmers (
        id, name, mobile, region_id, location_id, 
        cascade_id, village_id, primary_crop, 
        membership_type, joint_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId, 
      name, 
      mobile, 
      region_id, 
      location_id, 
      cascade_id, 
      village_id, 
      primary_crop, 
      membership_type, 
      joint_year
    ).run();

    // 4. Return success
    return new Response(JSON.stringify({ success: true, id: newId }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};