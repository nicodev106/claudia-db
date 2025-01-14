export type DatabaseType = "mariadb" | "mysql" | "sqlite" | "postgresql";

export interface BaseDatabaseConfig {
    host?: string;
    port?: number;
    dbname?: string;
    username?: string;
    password?: string;
    filepath?: string;
}
