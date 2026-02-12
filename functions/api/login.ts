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
  const { request, env } = context;

  try {
    const { mobile, password } = await request.json() as any;

    // 1. Validate Input
    if (!mobile || !password) {
      return new Response(JSON.stringify({ error: "Mobile and password are required" }), { status: 400 });
    }

    // 2. Check Database for matching user
    // We select the user ONLY if both mobile AND password match
    const user = await env.DB.prepare(`
      SELECT * FROM farmers WHERE mobile = ? AND password = ?
    `).bind(mobile, password).first();

    // 3. Handle Result
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Invalid Mobile Number or Password" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. Success! Return user data (excluding password for security)
    const { password: _, ...safeUser } = user; // Remove password from response
    
    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};