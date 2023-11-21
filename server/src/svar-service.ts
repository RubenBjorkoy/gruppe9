import pool from "./mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type Svar = {
	svarid?: number; //svarid is handled by the database
	svartekst: string;
	poeng: number;
	sporsmalid: number;
	dato: Date;
	sistendret: Date;
	ersvar: boolean;
	svarsvarid?: number | null; //svarsvarid is based on if ersvar is true or false
};

class SvarService {
	/**
	 * Get answers with given id.
	 */
	get(sporsmalid: number, svarid: number) {
		//Also use this to get comments.
		return new Promise<Svar | undefined>((resolve, reject) => {
			pool.query(
				"SELECT svarid, svartekst, poeng, sporsmalid, UNIX_TIMESTAMP(dato) as dato, UNIX_TIMESTAMP(sistendret) as sistendret, ersvar, svarsvarid FROM Svar WHERE sporsmalid = ? AND svarid = ?;",
				[sporsmalid, svarid],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);

					const roundedResults = results.map((result) => {
						return {
							...result,
							dato: new Date(result.dato * 1000),
							sistendret: new Date(result.sistendret * 1000),
						};
					});

					resolve(roundedResults[0] as Svar);
				}
			);
		});
	}

	/**
	 * Get all answers.
	 */
	getAll(sporsmalid: number) {
		return new Promise<Svar[]>((resolve, reject) => {
			pool.query(
				"SELECT svarid, svartekst, poeng, sporsmalid, UNIX_TIMESTAMP(dato) as dato, UNIX_TIMESTAMP(sistendret) as sistendret, ersvar, svarsvarid FROM Svar WHERE sporsmalid = ?;",
				[sporsmalid],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);

					const roundedResults = results.map((result) => {
						return {
							...result,
							dato: new Date(result.dato * 1000),
							sistendret: new Date(result.sistendret * 1000),
						};
					});

					resolve(roundedResults as Svar[]);
				}
			);
		});
	}

	/**
	 * Create new comment having the given title.
	 *
	 * Resolves the newly created task id.
	 */
	create(svar: Svar) {
		const unixDato = Math.floor(svar.dato.getTime() / 1000);
		const unixSistendret = Math.floor(svar.sistendret.getTime() / 1000);

		return new Promise<number>((resolve, reject) => {
			pool.query(
				"INSERT INTO Svar(svartekst, poeng, sporsmalid, dato, sistendret, ersvar, svarsvarid) VALUES (?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?) ",
				[
					svar.svartekst,
					svar.poeng,
					svar.sporsmalid,
					unixDato,
					unixSistendret,
					svar.ersvar,
					svar.svarsvarid,
				],
				(error, results: ResultSetHeader) => {
					if (error) {
						return reject(error);
					}

					//Mark a question as answered for the question this comment belongs to.
					//Is slightly redundant, as the question only needs to be marked as answered when the first comment is created,
					//but this is the easiest way to do it and it's better ot be safe than sorry
					pool.query(
						"UPDATE Sporsmal SET ersvart = true WHERE sporsmalid = ?",
						[svar.sporsmalid],
						(error, results: ResultSetHeader) => {
							if (error) {
								return reject(error);
							}
							if (results.affectedRows == 0)
								reject(new Error("Ingen rad oppdatert"));
						}
					);

					resolve(results.insertId);
				}
			);
		});
	}

	/**
	 * Updates a answers with a given ID
	 */
	update(svar: Svar, updateTime: boolean) {
		const unixSistendret = updateTime
			? Math.floor(new Date().getTime() / 1000)
			: Math.floor(new Date(svar.sistendret).getTime() / 1000);
		return new Promise<number>((resolve, reject) => {
			//dato will not change after initial insert, however sistendret updates for every change
			//Absolutely no need to edit sporsmalid, as a comment is tied to a sporsmalid
			//ersvar and svarsvarid should not be changed, as they are set on creation and will remain that way
			pool.query(
				"UPDATE Svar SET svartekst=?, poeng=?, sistendret=FROM_UNIXTIME(?) WHERE svarid=?",
				[svar.svartekst, svar.poeng, unixSistendret, svar.svarid],
				(error, results: ResultSetHeader) => {
					if (error) return reject(error);
					if (results.affectedRows == 0)
						reject(new Error("Ingen rad oppdatert"));

					resolve(results.affectedRows);
				}
			);
		});
	}

	/**
	 * Delete answers with given id.
	 */
	delete(svarid: number, fromQuestion?: boolean | undefined) {
		return new Promise<void>((resolve, reject) => {
			/**
			 * This function is extremely long compared to the other svarService functions. Let's break it down:
			 * After taking in an id and a possible boolean if the delete function was called from deleting a question,
			 * we first just delete ALL comments belonging to the question and end the function there.
			 * Then we check if the comment has any replies. If there's no replies, we can simply delete the comment. Easy.
			 * If there are replies, we need to delete all replies first. This is done by a recursive function.
			 * This recursive function first fetches all replies to the comment, then calls itself on each reply.
			 * This means that the function will first delete all replies to the comment, then delete the comment itself.
			 * After deleting the comment, we check if the question has any comments left. If not, we mark the question as unanswered.
			 */

			//If fromQuestion is true, we need to delete all comments on the question as well
			if (fromQuestion) {
				pool.query(
					"DELETE FROM Svar WHERE sporsmalid = ?",
					[svarid],
					(error, results: RowDataPacket[]) => {
						if (error) return reject(error);
						resolve();
					}
				);
			}

			//Check if comment has replies. If not, delete it.
			pool.query(
				"SELECT * FROM Svar WHERE svarsvarid = ?",
				[svarid],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);
					if (results.length == 0) {
						pool.query(
							"DELETE FROM Svar WHERE svarid = ?",
							[svarid],
							(error, _results: RowDataPacket[]) => {
								if (error) return reject(error);
								resolve();
							}
						);
					}
				}
			);

			//Recursive function to delete all comments on a comment
			//Is not actually required too be this advanced, but exists based on how the rest of the codebase is built
			//We removed the ability to comment on a comment to create long threads of comments already. But the code is still here.
			function deleteComments(commentId: number): Promise<void> {
				return new Promise<void>((resolve, reject) => {
					// Fetch replies first
					pool.query(
						"SELECT svarid FROM Svar WHERE svarsvarid = ?",
						[commentId],
						(error, rows: RowDataPacket[]) => {
							if (error) return reject(error);

							const deleteRepliesPromises = rows.map((row) =>
								deleteComments(row.svarid)
							);
							Promise.all(deleteRepliesPromises)
								.then(() => {
									// Delete the comment itself after deleting its replies
									pool.query(
										"DELETE FROM Svar WHERE svarid = ?",
										[commentId],
										(error, _results: RowDataPacket[]) => {
											if (error) return reject(error);
											resolve();
										}
									);
								})
								.catch((error) => reject(error));
						}
					);
				});
			}

			deleteComments(svarid)
				.then(() => {
					//Mark a question as unanswered if no more comments are left
					pool.query(
						"SELECT * FROM Svar WHERE sporsmalid = ?",
						[svarid],
						(error, results: RowDataPacket[]) => {
							if (error) return reject(error);
							if (results.length == 0) {
								pool.query(
									"UPDATE Sporsmal SET ersvart = false WHERE sporsmalid = ?",
									[svarid],
									(error, results: ResultSetHeader) => {
										if (error) {
											return reject(error);
										}
										if (results.affectedRows == 0)
											reject(new Error("Ingen rad oppdatert"));
									}
								);
							}
						}
					);

					resolve();
				})
				.catch((error) => reject(error));
		});
	}
}

const svarService = new SvarService();
export default svarService;
