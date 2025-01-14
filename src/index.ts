import type { BaseDatabaseConfig, DatabaseType } from "../types/database.types";
import * as connect from "./functions/connect";
import * as table from "./functions/table";

export { connect, table, type BaseDatabaseConfig, type DatabaseType };
