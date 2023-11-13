import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Sporsmal = {
  sporsmalid?: number;
  tittel: string;
  innhold: string;
  poeng: number;
  dato?: Date;
  sistendret?: Date;
  bestsvarid?: number;
  ersvart?: boolean;
};

class SporsmalService {
  /**
   * Get Sporsmal with given id.
   */
  get(sporsmalid: number) {
    return axios.get<Sporsmal>('/sporsmal/' + sporsmalid).then((response) => response.data);
  }

  /**
   * Get all Sporsmaler.
   */
  getAll() {
    return axios.get<Sporsmal[]>('/sporsmal').then((response) => response.data);
  }

  /**
   * Create new Sporsmal having the given tittel.
   *
   * Resolves the newly created Sporsmal id.
   */
  create(tittel: string, innhold: string, poeng: number, sporsmal?: number, dato?: Date, sistendret?: Date) {
    return axios
      .post<{ sporsmal: Sporsmal }>('/sporsmal', { tittel: tittel , innhold: innhold, poeng: poeng})
      .then((response) => response.data);
  }

  delete(sporsmalid: number) {
    return axios
    .delete<Sporsmal>('/sporsmal/' + sporsmalid)
    .then((response) => response.data);
    }
    
  put(sporsmalid: number) {
      return axios
      .put<Sporsmal>('/sporsmal/' + sporsmalid)
      .then((response) => response.data);
      }
}

const sporsmalService = new SporsmalService();
export default sporsmalService;
