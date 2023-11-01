import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Sporsmal = {
  sporsmalid: number;
  tittel: string;
  innhold: string;
  poeng: number;
  dato: Date;
  sistendret: Date;
};

class SporsmalService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return new Promise<Sporsmal | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM Sporsmal WHERE sporsmalid = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results[0] as Sporsmal);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Sporsmal[]>((resolve, reject) => {
      pool.query('SELECT * FROM Sporsmal', [], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Sporsmal[]);
      });
    });
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(sporsmal: Sporsmal) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Sporsmal SET tittel=?, innhold=?, poeng=?, dato=?, sistendret=?', [sporsmal.tittel, sporsmal.innhold, sporsmal.poeng, sporsmal.dato, sporsmal.sistendret], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  /**
   * Updates a task with a given ID
   */
  update(sporsmal: Sporsmal) {
    return new Promise<void>((resolve, reject) => {
      pool.query('UPDATE Sporsmal SET tittel=?, innhold=? WHERE sporsmalid=?', [sporsmal.tittel, sporsmal.innhold, sporsmal.sporsmalid], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row updated'));
      })
        resolve();
      })
    }

  /**
   * Delete task with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Tasks WHERE id = ?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row deleted'));

        resolve();
      });
    });
  }
}

const sporsmalService = new SporsmalService();
export default sporsmalService;
