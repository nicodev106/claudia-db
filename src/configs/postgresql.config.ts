import type { BaseDatabaseConfig } from "../../types/database.types";

export interface PostgreSQLConfig extends BaseDatabaseConfig {
	host: string;
	port: number;
	dbname: string;
	username: string;
	password: string;
}
