import pool from "./mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { Svar } from "./svar-service";

class FavorittService {
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
	 * Checks first if the question already exists on Favoritt table.
	 * If it does, it will reject the promise.
	 * If it does not, it will check if the Answer to be favorited even exists
	 * If it does not exist, then it will reject the promise.
	 *
	 * If said question does exist, then it will insert the question into the Favoritt table.
	 *
	 * Resolves the newly created question id.
	 */
	create(svarid: Number) {
		return new Promise<number>((resolve, reject) => {
			pool.query(
				"SELECT * FROM Favoritter WHERE svarid = ?",
				[svarid],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);
					if (results.length > 0) {
						return reject("Allerede favoritt");
					} else {
						pool.query(
							"SELECT * FROM Svar WHERE svarid = ?",
							[svarid],
							(error, results: RowDataPacket[]) => {
								if (error) return reject(error);
								if (results.length === 0) {
									return reject("Answer does not exist");
								} else {
									pool.query(
										"INSERT INTO Favoritter(svarid) VALUES (?)",
										[svarid],
										(error, results: ResultSetHeader) => {
											if (error) {
												return reject(error);
											}
											resolve(results.insertId);
										}
									);
								}
							}
						);
					}
				}
			);
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
					if (results.affectedRows == 0) reject(new Error("Ingen rad slettet"));

					resolve();
				}
			);
		});
	}
}

const favorittService = new FavorittService();
export default favorittService;
