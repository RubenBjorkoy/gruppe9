import pool from './mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Sporsmal } from './sporsmal-service';

export type Bruker = {
    brukerid?: number;
    brukernavn: string;
    poeng: number;
};

class BrukerService {
  /**
   * Get question with given id.
   */
  getAll() {
    //Gets all tags for a question
    return new Promise<Bruker[]>((resolve, reject) => {
        pool.query('SELECT * FROM Bruker', [], (error, results: RowDataPacket[]) => {
            if (error) return reject(error);

            const roundedResults = results.map(result => {
            return {
                ...result
            };
            });

            resolve(roundedResults as Bruker[]);
        });
    });
  }
  /**
   * Get all questions.
   */
  getSporsmalForTags(tagid: number) {
    //Gets all questions for a tag
    return new Promise<Sporsmal[]>((resolve, reject) => {
        pool.query('SELECT * FROM SporsmalTag WHERE tagid = ?', [tagid], (error, results: RowDataPacket[]) => {
            if (error) return reject(error);

            const roundedResults = results.map(result => {
            return {
                ...result
            };
            });

            resolve(roundedResults as Sporsmal[]);
        });
    });
  }

  /**
   * Create new question having the given title.
   *
   * Resolves the newly created question id.
   */
  create(user: Bruker) {
    return new Promise<number>((resolve, reject) => {


        pool.query('INSERT INTO Bruker(brukernavn, poeng) VALUES (?, ?) ', [user.brukernavn, user.poeng], (error, results: ResultSetHeader) => {
            if (error) {
            return reject(error);
            }
            resolve(results.insertId);
        });
    });
  }

  /**
   * Delete question with given id.
   * 
   * Deleting a question will also delete all answers to that question.
   */
  deleteRelation(sporsmalid: number, tagid: number) {
    return new Promise<void>((resolve, reject) => {
        pool.query('DELETE FROM SporsmalTag WHERE sporsmalid = ? AND tagid = ?', [sporsmalid, tagid], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows == 0) reject(new Error('No row deleted'));

            resolve();
        });
    });
  }
}

const brukerService = new BrukerService();
export default brukerService;
