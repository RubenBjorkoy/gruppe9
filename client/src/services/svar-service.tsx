import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/v2";

export type Svar = {
	svarid?: number; //svarid er håndtert hos server
	svartekst: string;
	poeng: number;
	sporsmalid: number;
	dato: Date | any;
	sistendret: Date | any;
	ersvar: boolean;
	svarsvarid?: number | null; //svarsvarid er basert på om ersvar er sann eller usann
};

class SvarService {

	get(sporsmalid: number, svarid: number) {
		return axios
			.get<Svar>(`/sporsmal/${sporsmalid}/svar/${svarid}`)
			.then((response) => response.data);
	}

	getAll(sporsmalid: number) {
		return axios
			.get<Svar[]>(`/sporsmal/${sporsmalid}/svar`)
			.then((response) => response.data);
	}

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
