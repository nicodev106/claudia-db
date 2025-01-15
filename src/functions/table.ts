import type { DatabaseType } from "../../types/database.types";
import { createMariaDBTable } from "./createTables/createMariaDBTable";
import { createMySQLTable } from "./createTables/createMySQLTable";
import { createPostgreSQLTable } from "./createTables/createPostgreSQLTable";
import { createSQLiteTable } from "./createTables/createSQLiteTable";
import { deleteMariaDBData } from "./deleteTables/deleteMariaDB";
import { deleteMySQLData } from "./deleteTables/deleteMySQL";
import { deletePostgreSQLData } from "./deleteTables/deletePostgreSQL";
import { deleteSQLiteData } from "./deleteTables/deleteSQLite";
import { getMariaDB } from "./getTables/getMariaDB";
import { getMySQL } from "./getTables/getMySQL";
import { getPostgreSQL } from "./getTables/getPostgreSQL";
import { getSQLite } from "./getTables/getSQLite";
import { insertMariaDBData } from "./intertTables/insertMariaDB";
import { insertMySQLData } from "./intertTables/insertMySQL";
import { insertPostgreSQLData } from "./intertTables/insertPostgreSQL";
import { insertSQLiteData } from "./intertTables/insertSQLite";
import { updateMariaDBData } from "./updateTables/updateMariaDB";
import { updateMySQLData } from "./updateTables/updateMySQL";
import { updatePostgreSQLData } from "./updateTables/updatePostgreSQL";
import { updateSQLiteData } from "./updateTables/updateSQLite";
import crypto from "crypto";

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
				type: any;
				isPrimaryKey?: boolean;
				isAutoIncrement?: boolean;
				isNullable?: boolean;
				length?: number;
				defaultValue?: any;
				unique?: boolean;
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
			if (colConfig.isNullable === false) columnDef += " NOT NULL";
			if (colConfig.unique) columnDef += " UNIQUE";
			if (colConfig.defaultValue !== undefined) columnDef += ` DEFAULT ${formatValue(colConfig.defaultValue)}`;

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
						.map(([key, value]) => `${key} (value)}`)
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
	public async insertData(tableName: string, data: { [key: string]: any }, secretColumns: string[]) {
		try {
			const columnsList = Object.keys(data).join(", ");
			const valuesList = Object.entries(data)
				.map(([column, value]) => {
					if (secretColumns.includes(column)) {
						return `'${encryptData(value)}'`;
					}
					return `'${value}'`;
				})
				.join(", ");

			switch (this.type) {
				case "mysql":
					return await insertMySQLData(this.connection, tableName, columnsList, valuesList);
				case "mariadb":
					return await insertMariaDBData(this.connection, tableName, columnsList, valuesList);
				case "postgresql":
					return await insertPostgreSQLData(this.connection, tableName, columnsList, valuesList);
				case "sqlite":
					return await insertSQLiteData(this.connection, tableName, columnsList, valuesList);
				default:
					throw new Error(`Base de datos no soportada: ${this.type}`);
			}
		} catch (error) {
			console.error(`Error al insertar datos en la tabla ${tableName} en ${this.type}:`, error);
			throw error;
		}
	}
	public async updateData(tableName: string, data: { [key: string]: any }, where: { [key: string]: any }) {
		try {
			let setClause = Object.entries(data)
				.map(([key, value]) => `${key} = ${formatValue(value)}`)
				.join(", ");

			let whereClause = "";
			if (where && Object.keys(where).length > 0) {
				whereClause = "WHERE " + Object.entries(where)
					.map(([key, value]) => `${key} = ${formatValue(value)}`)
					.join(" AND ");
			}

			switch (this.type) {
				case "mysql":
					return await updateMySQLData(this.connection, tableName, setClause, whereClause);
				case "mariadb":
					return await updateMariaDBData(this.connection, tableName, setClause, whereClause);
				case "postgresql":
					return await updatePostgreSQLData(this.connection, tableName, setClause, whereClause);
				case "sqlite":
					return await updateSQLiteData(this.connection, tableName, setClause, whereClause);
				default:
					throw new Error(`Base de datos no soportada: ${this.type}`);
			}
		} catch (error) {
			console.error(`Error al actualizar datos de la tabla ${tableName} en ${this.type}:`, error);
			throw error;
		}
	}
}

function formatValue(value: any): string {
	if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
	if (value === null) return "NULL";
	return value.toString();
}

function encryptData(data: string): string {
	const algorithm = "aes-256-cbc";
	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(data, "utf8", "hex");
	encrypted += cipher.final("hex");

	return `${iv.toString("hex")}:${encrypted}`;
}

export default Table;
