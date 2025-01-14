export async function updateSQLiteData(
	connection: any,
	tableName: string,
	setClause: string,
	whereClause: string,
) {
	const query = `UPDATE ${tableName} SET ${setClause} ${whereClause}`;

	return new Promise<void>((resolve, reject) => {
		connection.run(query, (err: any) => {
			if (err) reject(err);
			else {
				console.log(
					`Datos actualizados correctamente en la tabla ${tableName} en SQLite.`,
				);
				resolve();
			}
		});
	});
}
