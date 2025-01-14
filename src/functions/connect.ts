import type { DatabaseType } from "../../types/database.types";
import type { MariaDBConfig } from "../configs/mariadb.config";
import type { MySQLConfig } from "../configs/mysql.config";
import type { PostgreSQLConfig } from "../configs/postgresql.config";
import type { SQLiteConfig } from "../configs/sqlite.config";
import { connectMariaDB } from "../databases/mariadb";
import { connectMySQL } from "../databases/mysql";
import { connectPostgreSQL } from "../databases/postgresql";
import { connectSQLite } from "../databases/sqlite";

import Table from "./table";

export async function connect(type: DatabaseType, config: any): Promise<Table> {
	try {
		let connection: any;

		switch (type) {
			case "mariadb":
				connection = await connectMariaDB(config as MariaDBConfig);
				break;
			case "mysql":
				connection = await connectMySQL(config as MySQLConfig);
				break;
			case "sqlite":
				connection = await connectSQLite(config as SQLiteConfig);
				break;
			case "postgresql":
				connection = await connectPostgreSQL(config as PostgreSQLConfig);
				break;
			default:
				throw new Error(`Base de datos no soportada: ${type}`);
		}

		return new Table(type, connection);
	} catch (error) {
		console.error(`Error al conectar con ${type}:`, error);
		throw error;
	}
}
