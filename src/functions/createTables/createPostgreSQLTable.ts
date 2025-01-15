import type { Client } from "pg";

export async function createPostgreSQLTable(
	connection: Client,
	name: string,
	columns: { [key: string]: string },
) {
	const columnsDefinition = Object.entries(columns)
		.map(([column, type]) => `${column} ${type}`)
		.join(", ");

	const query = `CREATE TABLE IF NOT EXISTS ${name} (${columnsDefinition})`;

	try {
		await connection.query(query);
		console.log(`Tabla '${name}' creada correctamente en PostgreSQL.`);
	} catch (error) {
		console.error(`Error al crear la tabla '${name}' en PostgreSQL:`, error);
		throw error;
	}
}
