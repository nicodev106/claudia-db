import type { DatabaseType } from "../../types/database.types";
import { createMariaDBTable } from "./createTable/createMariaDBTable";
import { createMySQLTable } from "./createTable/createMySQLTable";
import { createPostgreSQLTable } from "./createTable/createPostgreSQLTable";
import { createSQLiteTable } from "./createTable/createSQLiteTable";
import { deleteMariaDBData } from "./deleteTables/deleteMariaDB";
import { deleteMySQLData } from "./deleteTables/deleteMySQL";
import { deletePostgreSQLData } from "./deleteTables/deletePostgreSQL";
import { deleteSQLiteData } from "./deleteTables/deleteSQLite";
import { getMariaDB } from "./getTables/getMariaDB";
import { getMySQL } from "./getTables/getMySQL";
import { getPostgreSQL } from "./getTables/getPostgreSQL";
import { getSQLite } from "./getTables/getSQLite";

class Table {
	private type: DatabaseType;
	private connection: any;

	constructor(type: DatabaseType, connection: any) {
		this.type = type;
		this.connection = connection;
	}

	public async new(config: {
		name: string;
		columns: {
			[key: string]: {
				type: string;
				isPrimaryKey?: boolean;
				isAutoIncrement?: boolean;
				length?: number;
			};
		};
	}) {
		const { name, columns } = config;
		const formattedColumns: { [key: string]: string } = {};
		for (const [colName, colConfig] of Object.entries(columns)) {
			let columnDef = colConfig.type;
			if (colConfig.length) columnDef += `(${colConfig.length})`;
			if (colConfig.isPrimaryKey) columnDef += " PRIMARY KEY";
			if (colConfig.isAutoIncrement) {
				if (this.type === "sqlite") columnDef += " AUTOINCREMENT";
				else if (this.type === "postgresql") columnDef += " SERIAL";
				else columnDef += " AUTO_INCREMENT";
			}
			formattedColumns[colName] = columnDef;
		}

		try {
			switch (this.type) {
				case "mariadb":
					await createMariaDBTable(this.connection, name, formattedColumns);
					break;
				case "mysql":
					await createMySQLTable(this.connection, name, formattedColumns);
					break;
				case "sqlite":
					await createSQLiteTable(this.connection, name, formattedColumns);
					break;
				case "postgresql":
					await createPostgreSQLTable(this.connection, name, formattedColumns);
					break;
				default:
					throw new Error(`Base de datos no soportada: ${this.type}`);
			}

			console.log(`Tabla ${name} creada correctamente en ${this.type}.`);
		} catch (error) {
			console.error(`Error al crear la tabla en ${this.type}:`, error);
		}
	}
	public async get(
		tableName: string,
		options: {
			where?: { [key: string]: any };
			order?: { column: string; direction: "ASC" | "DESC" };
			limit?: number;
			offset?: number;
		},
	) {
		try {
			switch (this.type) {
				case "mysql":
					return await getMySQL(this.connection, tableName, options);
				case "mariadb":
					return await getMariaDB(this.connection, tableName, options);
				case "postgresql":
					return await getPostgreSQL(this.connection, tableName, options);
				case "sqlite":
					return await getSQLite(this.connection, tableName, options);
				default:
					throw new Error(`Base de datos no soportada: ${this.type}`);
			}
		} catch (error) {
			console.error(
				`Error al obtener datos de la tabla ${tableName} en ${this.type}:`,
				error,
			);
			throw error;
		}
	}
	public async deleteData(tableName: string, where: { [key: string]: any }) {
		try {
			let whereClause = "";
			if (where && Object.keys(where).length > 0) {
				whereClause =
					"WHERE " +
					Object.entries(where)
						.map(([key, value]) => `${key} = ${formatValue(value)}`)
						.join(" AND ");
			}

			switch (this.type) {
				case "mysql":
					return await deleteMySQLData(this.connection, tableName, whereClause);
				case "mariadb":
					return await deleteMariaDBData(
						this.connection,
						tableName,
						whereClause,
					);
				case "postgresql":
					return await deletePostgreSQLData(
						this.connection,
						tableName,
						whereClause,
					);
				case "sqlite":
					return await deleteSQLiteData(
						this.connection,
						tableName,
						whereClause,
					);
				default:
					throw new Error(`Base de datos no soportada: ${this.type}`);
			}
		} catch (error) {
			console.error(
				`Error al eliminar datos de la tabla ${tableName} en ${this.type}:`,
				error,
			);
			throw error;
		}
	}
}

function formatValue(value: any): string {
	if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
	if (value === null) return "NULL";
	return value.toString();
}

export default Table;
