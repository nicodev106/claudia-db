import mysql from "mysql2";
import type { MariaDBConfig } from "../configs/mariadb.config";

export async function connectMariaDB(config: MariaDBConfig) {
	const connection = mysql.createConnection({
		host: config.host,
		port: config.port,
		user: config.username,
		password: config.password,
		database: config.dbname,
	});

	connection.connect((err) => {
		if (err) {
			console.error("Error al conectar con MariaDB:", err);
		} else {
			console.log("Conectado a MariaDB.");
		}
	});

	connection.end();
}
