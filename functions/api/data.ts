
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
    const farmers = await env.DB.prepare("SELECT * FROM farmers LIMIT 1").first();
    const cultivations = await env.DB.prepare("SELECT * FROM cultivations").all();
    const entries = await env.DB.prepare("SELECT * FROM entries").all();
    const queries = await env.DB.prepare("SELECT * FROM queries").all();
    const marketPosts = await env.DB.prepare("SELECT * FROM market_posts").all();
    
    // Master Data
    const regions = await env.DB.prepare("SELECT * FROM regions").all();
    const locations = await env.DB.prepare("SELECT * FROM locations").all();
    const cascades = await env.DB.prepare("SELECT * FROM cascades").all();
    const villages = await env.DB.prepare("SELECT * FROM villages").all();

    return new Response(JSON.stringify({
      farmer: farmers,
      cultivations: cultivations.results,
      entries: entries.results,
      queries: queries.results,
      marketPosts: marketPosts.results,
      regions: regions.results,
      locations: locations.results,
      cascades: cascades.results,
      villages: villages.results
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
