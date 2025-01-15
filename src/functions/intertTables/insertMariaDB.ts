export async function insertMariaDBData(connection: any, tableName: string, columns: string, values: string) {
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

    return new Promise<void>((resolve, reject) => {
        connection.query(query, (err: any) => {
            if (err) reject(err);
            else {
                console.log(`Datos insertados correctamente en la tabla ${tableName} en MariaDB.`);
                resolve();
            }
        });
    });
}
