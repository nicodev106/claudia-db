export async function updateMySQLData(
	connection: any,
	tableName: string,
	setClause: string,
	whereClause: string,
) {
	const query = `UPDATE ${tableName} SET ${setClause} ${whereClause}`;

	return new Promise<void>((resolve, reject) => {
		connection.query(query, (err: any) => {
			if (err) reject(err);
			else {
				console.log(
					`Datos actualizados correctamente en la tabla ${tableName} en MySQL.`,
				);
				resolve();
			}
		});
	});
}
