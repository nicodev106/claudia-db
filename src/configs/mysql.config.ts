import type { BaseDatabaseConfig } from "../../types/database.types";

export interface MySQLConfig extends BaseDatabaseConfig {
	host: string;
	port: number;
	dbname: string;
	username: string;
	password: string;
}
