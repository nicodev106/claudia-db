import type sqlite3 from "sqlite3";

export async function createSQLiteTable(
	connection: sqlite3.Database,
	name: string,
	columns: { [key: string]: string },
) {
	const columnsDefinition = Object.entries(columns)
		.map(([column, type]) => `${column} ${type}`)
		.join(", ");

	const query = `CREATE TABLE IF NOT EXISTS ${name} (${columnsDefinition})`;

	return new Promise<void>((resolve, reject) => {
		connection.run(query, (err: any) => {
			if (err) reject(err);
			else {
				console.log(`Tabla '${name}' creada correctamente en SQLite.`);
				resolve();
			}
		});
	});
}
