import axios from "axios";
import sporsmalTagService from "./sporsmalTag-service";

axios.defaults.baseURL = "http://localhost:3000/api/v2";

export type Sporsmal = {
	sporsmalid?: number;
	tittel: string;
	innhold: string;
	poeng: number;
	dato?: Date | any;
	sistendret?: Date | any;
	bestsvarid?: number;
	ersvart?: boolean;
};

class SporsmalService {
	/**
	 * Get Sporsmal with given id.
	 */
	get(sporsmalid: number) {
		return axios
			.get<Sporsmal>("/sporsmal/" + sporsmalid)
			.then((response) => response.data);
	}

	/**
	 * Get all Sporsmaler.
	 */
	getAll() {
		return axios.get<Sporsmal[]>("/sporsmal").then((response) => response.data);
	}

	/**
	 * Create new Sporsmal having the given tittel.
	 *
	 * Resolves the newly created Sporsmal id.
	 */
	create(
		tittel: string,
		innhold: string,
		chosenTags: number[],
		poeng?: number,
		sporsmal?: number,
		dato?: Date,
		sistendret?: Date
	) {
		return axios
			.post<{ id: number }>("/sporsmal", {
				tittel: tittel,
				innhold: innhold,
				poeng: poeng,
			})
			.then((response) => {
				chosenTags.forEach((tagid) => {
					sporsmalTagService.create(response.data.id, tagid);
				});
				response.data;
			});
	}

	delete(sporsmalid: number) {
		return axios
			.delete<Sporsmal>("/sporsmal/" + sporsmalid)
			.then((response) => response.data);
	}

	update(sporsmal: Sporsmal, updateTime: boolean = true) {
		//Add false to the update call to avoid updating time on update. For example when only updating score
		return axios
			.put<Sporsmal>("/sporsmal", [sporsmal as Sporsmal, updateTime])
			.then((response) => response.data);
	}
}

const sporsmalService = new SporsmalService();
export default sporsmalService;
