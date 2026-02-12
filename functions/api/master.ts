
interface D1Database {
  prepare(query: string): any;
}

type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const { type, data, id, action } = await request.json() as any;

  try {
    const tableMap: any = {
      'region': 'regions',
      'location': 'locations',
      'cascade': 'cascades',
      'village': 'villages'
    };
    const table = tableMap[type];
    if (!table) throw new Error("Invalid master data type");

    if (action === 'SAVE') {
      if (type === 'region') {
        await env.DB.prepare(`INSERT OR REPLACE INTO regions (id, name) VALUES (?, ?)`).bind(data.id, data.name).run();
      } else if (type === 'location') {
        await env.DB.prepare(`INSERT OR REPLACE INTO locations (id, region_id, name) VALUES (?, ?, ?)`).bind(data.id, data.regionId, data.name).run();
      } else if (type === 'cascade') {
        await env.DB.prepare(`INSERT OR REPLACE INTO cascades (id, location_id, name) VALUES (?, ?, ?)`).bind(data.id, data.locationId, data.name).run();
      } else if (type === 'village') {
        await env.DB.prepare(`INSERT OR REPLACE INTO villages (id, cascade_id, name) VALUES (?, ?, ?)`).bind(data.id, data.cascadeId, data.name).run();
      }
    } else if (action === 'DELETE') {
      await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    }

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
