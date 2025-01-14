export async function getMariaDB(
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

	return new Promise<any[]>((resolve, reject) => {
		connection.query(query, (err: any, results: any[]) => {
			if (err) reject(err);
			else resolve(results);
		});
	});
}

function formatValue(value: any): string {
	if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
	if (value === null) return "NULL";
	return value.toString();
}
