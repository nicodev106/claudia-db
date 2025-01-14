import sqlite3 from "sqlite3";
import type { SQLiteConfig } from "../configs/sqlite.config";

export async function connectSQLite(config: SQLiteConfig) {
	const db = new sqlite3.Database(
		config.filepath,
		sqlite3.OPEN_READWRITE,
		(err) => {
			if (err) {
				console.error("Error al conectar con SQLite:", err);
			} else {
				console.log("Conectado a SQLite.");
			}
		},
	);

	db.close();
}
