import type mysql from "mysql2";

export async function createMySQLTable(
	connection: mysql.Connection | mysql.PoolConnection,
	name: string,
	columns: { [key: string]: string },
) {
	const columnsDefinition = Object.entries(columns)
		.map(([column, type]) => `${column} ${type}`)
		.join(", ");

	const query = `CREATE TABLE IF NOT EXISTS ${name} (${columnsDefinition})`;

	return new Promise<void>((resolve, reject) => {
		connection.query(query, (err: any) => {
			if (err) reject(err);
			else {
				console.log(`Tabla '${name}' creada correctamente en MySQL.`);
				resolve();
			}
		});
	});
}
