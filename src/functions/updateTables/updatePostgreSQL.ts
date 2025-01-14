export async function updatePostgreSQLData(
	connection: any,
	tableName: string,
	setClause: string,
	whereClause: string,
) {
	const query = `UPDATE ${tableName} SET ${setClause} ${whereClause}`;

	try {
		await connection.query(query);
		console.log(
			`Datos actualizados correctamente en la tabla ${tableName} en PostgreSQL.`,
		);
	} catch (error) {
		console.error("Error al actualizar los datos:", error);
		throw error;
	}
}
