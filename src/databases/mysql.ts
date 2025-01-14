import mysql from "mysql2";
import type { MySQLConfig } from "../configs/mysql.config";

export async function connectMySQL(config: MySQLConfig) {
	const connection = mysql.createConnection({
		host: config.host,
		port: config.port,
		user: config.username,
		password: config.password,
		database: config.dbname,
	});

	connection.connect((err) => {
		if (err) {
			console.error("Error al conectar con MySQL:", err);
		} else {
			console.log("Conectado a MySQL.");
		}
	});

	connection.end();
}
