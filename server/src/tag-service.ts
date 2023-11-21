import pool from "./mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type Tag = {
	tagid?: number; //tagid is handled by the database
	navn: string;
	forklaring: string;
};

class TagService {
	/**
	 * Get tag with given id.
	 */
	get(id: number) {
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
	 * Get all tags.
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
	 * Create new tag with the passed tag as parameter.
	 *
	 * Resolves the newly created tag id.
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
	 * Updates a tag by the inserted tag by that's tag tagid
	 */
	update(tag: Tag) {
		return new Promise<number>((resolve, reject) => {
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
	 * Delete tag with given id.
	 *
	 * Deleting a tag will also delete all tag-questions relations.
	 */
	delete(tagid: number) {
		return new Promise<void>((resolve, reject) => {
			pool.query(
				"DELETE FROM Tag WHERE tagid = ?",
				[tagid],
				(error, results: ResultSetHeader) => {
					if (error) return reject(error);
					if (results.affectedRows == 0) reject(new Error("Ingen rad slettet"));

					pool.query("DELETE FROM SporsmalTag WHERE tagid = ?", [tagid]);

					resolve();
				}
			);
		});
	}
}

const tagService = new TagService();
export default tagService;
