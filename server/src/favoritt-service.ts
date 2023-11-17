import pool from "./mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { Svar } from "./svar-service";

class FavorittService {
	query(sql: string, values: any): Promise<RowDataPacket[]> {
		return new Promise((resolve, reject) => {
			pool.query(sql, values, (error, results: RowDataPacket[]) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	}
	/**
	 * Get all answers also located in favorites table.
	 */
	getAll() {
		return new Promise<Svar[]>((resolve, reject) => {
			pool.query(
				"SELECT * FROM Svar S JOIN Favoritter F ON S.svarid = F.svarid;",
				[],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);

					const roundedResults = results.map((result) => {
						return {
							...result,
						};
					});

					resolve(roundedResults as Svar[]);
				}
			);
		});
	}

	/**
	 * Create new question having the given title.
	 *
	 * Resolves the newly created question id.
	 */
	create(svarid: Number) {
		return new Promise<number>(async (resolve, reject) => {
			try {
				// Check if relation already exists
				const favoritterResults = await this.query(
					"SELECT * FROM Favoritter WHERE svarid = ?",
					[svarid]
				);
				if (favoritterResults.length > 0) {
					return reject("Already favorited");
				}

				// Check if answer exists
				const svarResults = await this.query(
					"SELECT * FROM Svar WHERE svarid = ?",
					[svarid]
				);
				if (svarResults.length === 0) {
					return reject("Answer does not exist");
				}

				// Execute the INSERT query
				const insertResults = await this.query(
					"INSERT INTO Favoritter(svarid) VALUES (?)",
					[svarid]
				);

				resolve(insertResults[0].insertId);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Delete question with given id.
	 *
	 * Deleting a question will also delete all answers to that question.
	 */
	delete(svarid: number) {
		return new Promise<void>((resolve, reject) => {
			pool.query(
				"DELETE FROM Favoritter WHERE svarid = ?",
				[svarid],
				(error, results: ResultSetHeader) => {
					if (error) return reject(error);
					if (results.affectedRows == 0) reject(new Error("No row deleted"));

					resolve();
				}
			);
		});
	}
}

const favorittService = new FavorittService();
export default favorittService;
