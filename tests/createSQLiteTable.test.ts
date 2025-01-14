import sqlite3 from 'sqlite3';
import Table from '../src/functions/table';

describe('Table class - new() method', () => {
    let db: sqlite3.Database;
    let table: Table;

    beforeAll(() => {
        db = new sqlite3.Database(':memory:');
        table = new Table('sqlite', db);
    });

    afterAll(() => {
        db.close();
    });

    it('should create the "products" table successfully in SQLite', async () => {
        const columns = {
            id: { type: "INTEGER", isPrimaryKey: true, isAutoIncrement: true },
            name: { type: "TEXT" },
            price: { type: "DECIMAL" },
        };

        await table.new({
            name: 'products',
            columns: columns,
        });

        interface Row {
            name: string;
        }

        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'", (err, row: Row) => {
            expect(row).toBeDefined();
            expect(row.name).toBe('products');
        });
    });

    it('should add columns with correct types in the "products" table', async () => {
        const columns = {
            id: { type: "INTEGER", isPrimaryKey: true, isAutoIncrement: true },
            name: { type: "TEXT" },
            price: { type: "DECIMAL" },
        };

        await table.new({
            name: 'products',
            columns: columns,
        });

        interface ColumnInfo {
            name: string;
        }

        db.all("PRAGMA table_info(products);", (err, rows: ColumnInfo[]) => {
            expect(rows).toBeDefined();
            expect(rows).toHaveLength(3);

            expect(rows[0].name).toBe('id');
            expect(rows[1].name).toBe('name');
            expect(rows[2].name).toBe('price');
        });
    });
});
