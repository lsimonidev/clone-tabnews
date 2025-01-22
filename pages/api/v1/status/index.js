import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsValue = parseInt(databaseMaxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB
  const databaseOpenConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;", 
    values:[databaseName]
  });
  const databaseOpenConnectionsValue = databaseOpenConnectionsResult.rows[0].count;
  
  res.status(200).json({updated_at: updatedAt, 
    dependencies:{ 
      database:{
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        open_connections: databaseOpenConnectionsValue,
      }
    }
  });
}

export default status;