import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

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
   * Get Sporsmal with given id.
   */
  get(id: number) {
    return axios.get<Sporsmal>('/Sporsmals/' + id).then((response) => response.data);
  }

  /**
   * Get all Sporsmals.
   */
  getAll() {
    return axios.get<Sporsmal[]>('/Sporsmals').then((response) => response.data);
  }

  /**
   * Create new Sporsmal having the given title.
   *
   * Resolves the newly created Sporsmal id.
   */
  create(title: string) {
    return axios
      .post<{ id: number }>('/Sporsmals', { title: title })
      .then((response) => response.data.id);
  }

  delete(id: number) {
    return axios
    .delete<Sporsmal>('/Sporsmals/' + id)
    .then((response) => response.data);
    }
    
  put(id: number) {
      return axios
      .put<Sporsmal>('/Sporsmals/' + id)
      .then((response) => response.data);
      }
}

const sporsmalService = new SporsmalService();
export default SporsmalService;
