
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
    const farmersAll = await env.DB.prepare(`
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

    const cultivations = await env.DB.prepare("SELECT * FROM cultivations").all();
    const entries = await env.DB.prepare("SELECT * FROM entries").all();
    const queries = await env.DB.prepare("SELECT * FROM queries").all();
    const marketPosts = await env.DB.prepare("SELECT * FROM market_posts").all();
    
    // Master Data with explicit aliasing to match TypeScript interfaces (camelCase)
    const regions = await env.DB.prepare("SELECT id, name FROM regions").all();
    const locations = await env.DB.prepare("SELECT id, region_id AS regionId, name FROM locations").all();
    const cascades = await env.DB.prepare("SELECT id, location_id AS locationId, name FROM cascades").all();
    const villages = await env.DB.prepare("SELECT id, cascade_id AS cascadeId, name FROM villages").all();

    return new Response(JSON.stringify({
      farmer: farmersAll.results.length > 0 ? farmersAll.results[0] : null,
      farmers: farmersAll.results || [],
      cultivations: cultivations.results || [],
      entries: entries.results || [],
      queries: queries.results || [],
      marketPosts: marketPosts.results || [],
      regions: regions.results || [],
      locations: locations.results || [],
      cascades: cascades.results || [],
      villages: villages.results || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("D1 Fetch Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
