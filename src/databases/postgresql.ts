import { Client } from "pg";
import type { PostgreSQLConfig } from "../configs/postgresql.config";

export async function connectPostgreSQL(config: PostgreSQLConfig) {
	const client = new Client({
		host: config.host,
		port: config.port,
		user: config.username,
		password: config.password,
		database: config.dbname,
	});

	await client.connect();
	console.log("Conectado a PostgreSQL.");
	await client.end();
}
