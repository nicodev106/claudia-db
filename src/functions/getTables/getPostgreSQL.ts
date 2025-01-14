export async function getPostgreSQL(
	connection: any,
	tableName: string,
	options: {
		where?: { [key: string]: any };
		order?: { column: string; direction: "ASC" | "DESC" };
		limit?: number;
		offset?: number;
	},
) {
	const { where, order, limit, offset } = options || {};
	const whereClause = where
		? "WHERE " +
			Object.entries(where)
				.map(([key, value]) => `${key} = ${formatValue(value)}`)
				.join(" AND ")
		: "";
	const orderClause = order
		? `ORDER BY ${order.column} ${order.direction}`
		: "";
	const limitClause = limit ? `LIMIT ${limit}` : "";
	const offsetClause = offset ? `OFFSET ${offset}` : "";

	const query =
		`SELECT * FROM ${tableName} ${whereClause} ${orderClause} ${limitClause} ${offsetClause}`.trim();

	try {
		const result = await connection.query(query);
		return result.rows;
	} catch (error) {
		console.error("Error al obtener los datos de PostgreSQL:", error);
		throw error;
	}
}

function formatValue(value: any): string {
	if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
	if (value === null) return "NULL";
	return value.toString();
}
