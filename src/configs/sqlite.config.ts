import type { BaseDatabaseConfig } from "../../types/database.types";

export interface SQLiteConfig extends BaseDatabaseConfig {
	filepath: string;
}
