export async function deleteMySQLData(
	connection: any,
	tableName: string,
	whereClause: string,
) {
	const query = `DELETE FROM ${tableName} ${whereClause}`;

	return new Promise<void>((resolve, reject) => {
		connection.query(query, (err: any) => {
			if (err) reject(err);
			else {
				console.log(
					`Datos eliminados correctamente de la tabla ${tableName} en MySQL.`,
				);
				resolve();
			}
		});
	});
}
