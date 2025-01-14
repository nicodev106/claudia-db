declare module 'claudia-db' {
    import type { Database } from 'sqlite3';

    type DatabaseType = 'sqlite' | 'mysql' | 'mariadb' | 'postgresql';

    interface ColumnConfig {
        type: string;
        isPrimaryKey?: boolean;
        isAutoIncrement?: boolean;
        length?: number;
    }

    interface GetOptions {
        where?: Record<string, any>;
        order?: { column: string; direction: 'ASC' | 'DESC' };
        limit?: number;
        offset?: number;
    }

    interface TableConfig {
        name: string;
        columns: Record<string, ColumnConfig>;
    }

    class Table {
        private type: DatabaseType;
        private connection: any;

        constructor(type: DatabaseType, connection: any);

        /**
         * Creates a new table with the given configuration.
         */
        new(config: TableConfig): Promise<void>;

        /**
         * Retrieves data from a table with optional filters.
         */
        get(tableName: string, options: GetOptions): Promise<any[]>;

        /**
         * Deletes data from a table based on a 'where' condition.
         */
        deleteData(tableName: string, where: Record<string, any>): Promise<void>;
    }

    export default Table;
}
