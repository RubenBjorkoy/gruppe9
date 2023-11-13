import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Tag = {
  tagid?: number; //sporsmalid is handled by the database
  navn: string;
  forklaring: string;
};

class TagService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    //Also use this to get comments.
    return new Promise<Tag | undefined>((resolve, reject) => {
      pool.query('SELECT tagid, navn, forklaring FROM Tag WHERE tagid = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Tag);
      });
    });
  }
  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Tag[]>((resolve, reject) => {
      pool.query('SELECT tagid, navn, forklaring FROM Tag;', [], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Tag[]);
      });
    });
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(tag: Tag) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Tag(navn, forklaring) VALUES (?, ?) ', [tag.navn, tag.forklaring], (error, results: ResultSetHeader) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      });
    });
  }

  /**
   * Updates a tag with a given ID
   */
  update(tag: Tag) {
    return new Promise<number>((resolve, reject) => {
      //dato will not change after initial insert, however sistendret updates for every change.
      pool.query('UPDATE Sporsmal SET navn=?, forklaring=? WHERE tagid=?', [tag.navn, tag.forklaring], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row updated'));

        resolve(results.affectedRows);
      })
      })
    }

  /**
   * Delete tag with given id.
   */
  delete(tagid: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Tag WHERE tagid = ?', [tagid], async (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row deleted'));

        resolve();
      });
    });
  }
}

const tagService = new TagService();
export default tagService;
