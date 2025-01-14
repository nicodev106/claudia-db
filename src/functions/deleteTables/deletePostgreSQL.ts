export async function deletePostgreSQLData(
	connection: any,
	tableName: string,
	whereClause: string,
) {
	const query = `DELETE FROM ${tableName} ${whereClause}`;

	try {
		await connection.query(query);
		console.log(
			`Datos eliminados correctamente de la tabla ${tableName} en PostgreSQL.`,
		);
	} catch (error) {
		console.error("Error al eliminar los datos:", error);
		throw error;
	}
}
