import { Connection, createConnection, QueryOptions, RowDataPacket } from "mysql2/promise";
import CDate from "./CDate";

export default class Database {
	connection: Connection | undefined;
	database: string;
	constructor(database: string) {
		this.database = database;
	}

	async init() {
		// if (this.connection?.ping()) return;
		this.connection = await createConnection({
			host: "localhost",
			user: "chenzadik",
			password: "password",
			database: this.database,
			timezone: new CDate().getLocalDateOffset(),
		});
	}

	async query<T extends RowDataPacket>(args: QueryOptions) {
		await this.init();

		if (!this.connection) return [];

		return this.connection.query(args).then((data) => data[0]) as Promise<T[]>;
	}
}
