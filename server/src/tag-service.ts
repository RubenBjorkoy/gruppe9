import pool from "./mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type Tag = {
	tagid?: number; //sporsmalid is handled by the database
	navn: string;
	forklaring: string;
};

class TagService {
	/**
	 * Get question with given id.
	 */
	get(id: number) {
		//Also use this to get comments.
		return new Promise<Tag | undefined>((resolve, reject) => {
			pool.query(
				"SELECT * FROM Tag WHERE tagid = ?",
				[id],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);

					const roundedResults = results.map((result) => {
						return {
							...result,
						};
					});

					resolve(roundedResults[0] as Tag);
				}
			);
		});
	}
	/**
	 * Get all questions.
	 */
	getAll() {
		return new Promise<Tag[]>((resolve, reject) => {
			pool.query(
				"SELECT * FROM Tag;",
				[],
				(error, results: RowDataPacket[]) => {
					if (error) return reject(error);

					const roundedResults = results.map((result) => {
						return {
							...result,
						};
					});

					resolve(roundedResults as Tag[]);
				}
			);
		});
	}

	/**
	 * Create new question having the given title.
	 *
	 * Resolves the newly created question id.
	 */
	create(tag: Tag) {
		return new Promise<number>((resolve, reject) => {
			pool.query(
				"INSERT INTO Tag(navn, forklaring) VALUES (?, ?) ",
				[tag.navn, tag.forklaring],
				(error, results: ResultSetHeader) => {
					if (error) {
						return reject(error);
					}
					resolve(results.insertId);
				}
			);
		});
	}

	/**
	 * Updates a question with a given ID
	 */
	update(tag: Tag) {
		return new Promise<number>((resolve, reject) => {
			//dato will not change after initial insert, however sistendret updates for every change.
			pool.query(
				"UPDATE Tag SET navn=?, forklaring=? WHERE tagid=?",
				[tag.navn, tag.forklaring, tag.tagid],
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
	 * Delete question with given id.
	 *
	 * Deleting a question will also delete all answers to that question.
	 */
	delete(tagid: number) {
		return new Promise<void>((resolve, reject) => {
			pool.query(
				"DELETE FROM Tag WHERE tagid = ?",
				[tagid],
				(error, results: ResultSetHeader) => {
					if (error) return reject(error);
					if (results.affectedRows == 0) reject(new Error("Ingen rad slettet"));

					resolve();
				}
			);
		});
	}
}

const tagService = new TagService();
export default tagService;
