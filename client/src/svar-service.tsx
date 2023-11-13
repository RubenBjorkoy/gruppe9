import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Svar = {
  svarid?: number; //svarid is handled by the database
  svartekst: string;
  poeng: number;
  sporsmalid: number;
  erbest: boolean;
  dato: Date;
  sistendret: Date;
  ersvar: boolean;
  svarsvarid?: number | null; //svarsvarid is based on if ersvar is true or false
};

class SvarService {
  /**
   * Get Sporsmal with given id.
   */
  get(sporsmalid: number, svarid: number) {
    return axios.get<Svar>('/sporsmal/' + svarid).then((response) => response.data);
  }

  /**
   * Get all Sporsmaler.
   */
  getAll(sporsmalid: number) {
    return axios.get<Svar[]>('/sporsmal').then((response) => response.data);
  }

  /**
   * Create new Sporsmal having the given tittel.
   *
   * Resolves the newly created Sporsmal id.
   */
  create(tittel: string, innhold: string, poeng: number, sporsmal?: number, dato?: Date, sistendret?: Date) {
    return axios
      .post<{ sporsmal: Svar }>('/sporsmal', { tittel: tittel , innhold: innhold, poeng: poeng})
      .then((response) => response.data);
  }

  delete(sporsmalid: number) {
    return axios
    .delete<Svar>('/sporsmal/' + svarid)
    .then((response) => response.data);
    }
    
  put(sporsmalid: number) {
      return axios
      .put<Svar>('/sporsmal/' + svarid)
      .then((response) => response.data);
      }
}

const svarService = new SvarService();
export default svarService;
