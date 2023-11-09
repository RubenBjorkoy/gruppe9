import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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
   * Get task with given id.
   */
  get(sporsmalid: number, svarid: number) {
    //Also use this to get comments.
    return new Promise<Svar | undefined>((resolve, reject) => {
      pool.query('SELECT svarid, svartekst, poeng, sporsmalid, UNIX_TIMESTAMP(dato) as dato, UNIX_TIMESTAMP(sistendret) as sistendret, ersvar, svarsvarid FROM Svar WHERE sporsmalid = ? AND svarid = ?;', [sporsmalid, svarid], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        const roundedResults = results.map(result => {
          return {
            ...result,
            dato: new Date(result.dato * 1000),
            sistendret: new Date(result.sistendret * 1000),
          };
        });

        resolve(roundedResults[0] as Svar);
      });
    });
  }

  /**
   * Get all tasks.
   */
  getAll(sporsmalid: number) {
    return new Promise<Svar[]>((resolve, reject) => {
      pool.query('SELECT svarid, svartekst, poeng, sporsmalid, UNIX_TIMESTAMP(dato) as dato, UNIX_TIMESTAMP(sistendret) as sistendret, ersvar, svarsvarid FROM Svar WHERE sporsmalid = ?;', [sporsmalid], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        const roundedResults = results.map(result => {
          return {
            ...result,
            dato: new Date(result.dato * 1000),
            sistendret: new Date(result.sistendret * 1000),
          };
        });

        resolve(roundedResults as Svar[]);
      });
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
      pool.query('INSERT INTO Svar(svartekst, poeng, sporsmalid, dato, sistendret, ersvar, svarsvarid) VALUES (?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?) ', [svar.svartekst, svar.poeng, svar.sporsmalid, unixDato, unixSistendret, svar.ersvar, svar.svarsvarid], (error, results: ResultSetHeader) => {
        if (error) {
          return reject(error);
        }

        //Mark a question as answered for the question this comment belongs to.
        //Is slightly redundant, as the question only needs to be marked as answered when the first comment is created,
        //but this is the easiest way to do it and it's better ot be safe than sorry
        pool.query('UPDATE Sporsmal SET ersvart = true WHERE sporsmalid = ?', [svar.sporsmalid], (error, results: ResultSetHeader) => {
          if (error) {
            return reject(error);
          }
          if(results.affectedRows == 0) reject(new Error('No row updated'));
        });

        resolve(results.insertId);
      });
    });
  }

  /**
   * Updates a task with a given ID
   */
  update(svar: Svar) {
    const unixSistendret = Math.floor(new Date().getTime() / 1000);
    return new Promise<number>((resolve, reject) => {
      //dato will not change after initial insert, however sistendret updates for every change
      //Absolutely no need to edit sporsmalid, as a comment is tied to a sporsmalid
      //ersvar and svarsvarid should not be changed, as they are set on creation and will remain that way
      pool.query('UPDATE Svar SET svartekst=?, poeng=?, sistendret=FROM_UNIXTIME(?) WHERE svarid=?', [svar.svartekst, svar.poeng, unixSistendret, svar.svarid], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) reject(new Error('No row updated'));

        resolve(results.affectedRows);
      })
      })
    }

  /**
   * Delete task with given id.
   */
  delete(svarid: number, fromQuestion?: boolean | undefined) {
    return new Promise<void>((resolve, reject) => {

      //If fromQuestion is true, we need to delete all comments on the question as well

      if(fromQuestion) {
        pool.query('SELECT * FROM Svar WHERE svarsvarid = (SELECT svarid FROM Svar WHERE sporsmalid = ?)', [svarid], (error, results: RowDataPacket[]) => {
          if(error) return reject(error);
          if(results.length == 0) {
            pool.query('DELETE FROM Svar WHERE sporsmalid = ?', [svarid], (error, _results: RowDataPacket[]) => {
              if (error) return reject(error);
              resolve();
            });
          }
        });
      }

      pool.query('SELECT * FROM Svar WHERE svarsvarid = ?', [svarid], (error, results: RowDataPacket[]) => {
        if(error) return reject(error);
        if(results.length == 0) {
          pool.query('DELETE FROM Svar WHERE svarid = ?', [svarid], (error, _results: RowDataPacket[]) => {
            if (error) return reject(error);
            resolve();
          });
        }
      });

      function deleteComments(commentId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          // Fetch replies first
          pool.query('SELECT svarid FROM Svar WHERE svarsvarid = ?', [commentId], (error, rows: RowDataPacket[]) => {
            if (error) return reject(error);
  
            const deleteRepliesPromises = rows.map((row) => deleteComments(row.svarid));
            Promise.all(deleteRepliesPromises)
              .then(() => {
                // Delete the comment itself after deleting its replies
                pool.query('DELETE FROM Svar WHERE svarid = ?', [commentId], (error, _results: RowDataPacket[]) => {
                  if (error) return reject(error);
                  resolve();
                });
              })
              .catch((error) => reject(error));
          });
        });
      }
  
      deleteComments(svarid)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
  
}

const svarService = new SvarService();
export default svarService;
