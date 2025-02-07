import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(req, res) {

  let dbClient;

  if (req.method === "GET") {
    dbClient = await database.getNewClient();
    const migrations = await migrationRunner({
      dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    dbClient.end();
    return res.status(200).json(migrations);
  }

  if (req.method === "POST") {
    dbClient = await database.getNewClient();
    const migrations = await migrationRunner({
      dbClient,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
    dbClient.end();
    return res.status(200).json(migrations);
  }
  
  return res.status(405).end;
}
