export async function deleteSQLiteData(
	connection: any,
	tableName: string,
	whereClause: string,
) {
	const query = `DELETE FROM ${tableName} ${whereClause}`;

	return new Promise<void>((resolve, reject) => {
		connection.run(query, (err: any) => {
			if (err) reject(err);
			else {
				console.log(
					`Datos eliminados correctamente de la tabla ${tableName} en SQLite.`,
				);
				resolve();
			}
		});
	});
}
