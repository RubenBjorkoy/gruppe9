import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/v2";

export type Svar = {
	svarid?: number; //svarid is handled by the database
	svartekst: string;
	poeng: number;
	sporsmalid: number;
	dato: Date | any;
	sistendret: Date | any;
	ersvar: boolean;
	svarsvarid?: number | null; //svarsvarid is based on if ersvar is true or false
};

class SvarService {
	/**
	 * Get answers with given sporsmalid and svarid.
	 */
	get(sporsmalid: number, svarid: number) {
		return axios
			.get<Svar>(`/sporsmal/${sporsmalid}/svar/${svarid}`)
			.then((response) => response.data);
	}

	/**
	 * Get all answers to a given question.
	 */
	getAll(sporsmalid: number) {
		return axios
			.get<Svar[]>(`/sporsmal/${sporsmalid}/svar`)
			.then((response) => response.data);
	}

	/**
	 * Create new Answer to a given question.
	 *
	 * Resolves the newly created svarid.
	 */
	create(
		svartekst: string,
		sporsmalid: number,
		poeng: number,
		ersvar: boolean,
		svarsvarid?: number
	) {
		return axios
			.post<{ svar: Svar }>(`/sporsmal/${sporsmalid}/svar`, {
				svartekst: svartekst,
				sporsmalid: sporsmalid,
				poeng: poeng,
				ersvar: ersvar,
				svarsvarid: svarsvarid ? svarsvarid : null,
			})
			.then((response) => response.data);
	}

	delete(svar: Svar) {
		return axios
			.delete<Svar>(`/sporsmal/${svar.sporsmalid}/svar/${svar.svarid}`)
			.then((response) => response.data);
	}

	update(svar: Svar, sporsmalid: number, updateTime: boolean = true) {
		return axios
			.put<Svar>(`/sporsmal/${sporsmalid}/svar`, [svar, updateTime])
			.then((response) => response.data);
	}
}

const svarService = new SvarService();
export default svarService;
