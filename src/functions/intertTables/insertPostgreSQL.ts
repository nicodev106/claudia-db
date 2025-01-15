export async function insertPostgreSQLData(connection: any, tableName: string, columns: string, values: string) {
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

    try {
        await connection.query(query);
        console.log(`Datos insertados correctamente en la tabla ${tableName} en PostgreSQL.`);
    } catch (error) {
        console.error("Error al insertar los datos:", error);
        throw error;
    }
}
