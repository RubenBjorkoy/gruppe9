import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import svarService from './svar-service';

export type Sporsmal = {
  sporsmalid?: number; //sporsmalid is handled by the database
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
    //Also use this to get comments.
    return new Promise<Sporsmal | undefined>((resolve, reject) => {
      pool.query('SELECT sporsmalid, tittel, innhold, poeng, UNIX_TIMESTAMP(dato) as dato, UNIX_TIMESTAMP(sistendret) as sistendret FROM Sporsmal WHERE sporsmalid = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        const roundedResults = results.map(result => {
          return {
            ...result,
            dato: new Date(result.dato * 1000),
            sistendret: new Date(result.sistendret * 1000),
          };
        });

        resolve(roundedResults[0] as Sporsmal);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return new Promise<Sporsmal[]>((resolve, reject) => {
      pool.query('SELECT sporsmalid, tittel, innhold, poeng, UNIX_TIMESTAMP(dato) as dato, UNIX_TIMESTAMP(sistendret) as sistendret FROM Sporsmal;', [], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        const roundedResults = results.map(result => {
          return {
            ...result,
            dato: new Date(result.dato * 1000),
            sistendret: new Date(result.sistendret * 1000),
          };
        });

        resolve(roundedResults as Sporsmal[]);
      });
    });
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(sporsmal: Sporsmal) {
    const unixDato = Math.floor(sporsmal.dato.getTime() / 1000);
    const unixSistendret = Math.floor(sporsmal.sistendret.getTime() / 1000);

    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO Sporsmal(tittel, innhold, poeng, dato, sistendret) VALUES (?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?)) ', [sporsmal.tittel, sporsmal.innhold, sporsmal.poeng, unixDato, unixSistendret], (error, results: ResultSetHeader) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      });
    });
  }

  /**
   * Updates a task with a given ID
   */
  update(sporsmal: Sporsmal) {
    const unixSistendret = Math.floor(new Date().getTime() / 1000);
    return new Promise<number>((resolve, reject) => {
      //dato will not change after initial insert, however sistendret updates for every change
      pool.query('UPDATE Sporsmal SET tittel=?, innhold=?, poeng=?, sistendret=FROM_UNIXTIME(?) WHERE sporsmalid=?', [sporsmal.tittel, sporsmal.innhold, sporsmal.poeng, unixSistendret, sporsmal.sporsmalid], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row updated'));

        resolve(results.affectedRows);
      })
      })
    }

  /**
   * Delete task with given id.
   * 
   * Deleting a question will also delete all answers to that question.
   */
  delete(sporsmalid: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM Sporsmal WHERE sporsmalid = ?', [sporsmalid], async (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row deleted'));

        await svarService.delete(sporsmalid, true)

        resolve();
      });
    });
  }
}

const sporsmalService = new SporsmalService();
export default sporsmalService;
