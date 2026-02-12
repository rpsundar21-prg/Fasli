
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

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    // Fetch all farmers for registry/duplicate check
    const farmersRaw = await env.DB.prepare(`
      SELECT 
        id, name, mobile, 
        region_id AS regionId, 
        location_id AS locationId, 
        cascade_id AS cascadeId, 
        village_id AS villageId, 
        primary_crop AS primaryCrop, 
        membership_type AS membershipType, 
        joint_year AS jointYear 
      FROM farmers
    `).all();
    const farmers = farmersRaw.results || [];

    const cultivationsRaw = await env.DB.prepare("SELECT * FROM cultivations").all();
    const entriesRaw = await env.DB.prepare("SELECT * FROM entries").all();
    const queriesRaw = await env.DB.prepare("SELECT * FROM queries").all();
    const marketPostsRaw = await env.DB.prepare("SELECT * FROM market_posts").all();
    
    // Master Data with explicit aliasing to match TypeScript interfaces (camelCase)
    const regionsRaw = await env.DB.prepare("SELECT id, name FROM regions").all();
    const locationsRaw = await env.DB.prepare("SELECT id, region_id AS regionId, name FROM locations").all();
    const cascadesRaw = await env.DB.prepare("SELECT id, location_id AS locationId, name FROM cascades").all();
    const villagesRaw = await env.DB.prepare("SELECT id, cascade_id AS cascadeId, name FROM villages").all();

    return new Response(JSON.stringify({
      farmer: farmers.length > 0 ? farmers[0] : null,
      farmers: farmers,
      cultivations: cultivationsRaw.results || [],
      entries: entriesRaw.results || [],
      queries: queriesRaw.results || [],
      marketPosts: marketPostsRaw.results || [],
      regions: regionsRaw.results || [],
      locations: locationsRaw.results || [],
      cascades: cascadesRaw.results || [],
      villages: villagesRaw.results || []
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error: any) {
    console.error("D1 Fetch Error:", error);
    return new Response(JSON.stringify({ error: error.message, regions: [], locations: [], cascades: [], villages: [] }), {
      status: 200, // Return 200 with empty arrays to prevent frontend crash
      headers: { "Content-Type": "application/json" }
    });
  }
};
