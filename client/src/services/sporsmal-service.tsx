import axios from "axios";
import sporsmalTagService from "./sporsmalTag-service";
import { Tag } from "./tag-service";

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
	 * Hent Sporsmål med gitt sporsmalid.
	 */
	get(sporsmalid: number) {
		return axios
			.get<Sporsmal>("/sporsmal/" + sporsmalid)
			.then((response) => response.data);
	}

	/**
	 * Hent alle Sporsmaler.
	 */
	getAll() {
		return axios.get<Sporsmal[]>("/sporsmal").then((response) => response.data);
	}

	/**
	 * Lag nytt Spørsmål med gitt tittel og innhold.
	 *
	 * Lage det nye spørsmålet sitt sporsmalid.
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
		return (
			axios
				.post<{ id: number }>("/sporsmal", {
					tittel: tittel,
					innhold: innhold,
					poeng: poeng,
				})
				// Gammel code. Endret til async pga at testinga feila.
				// .then((response) => {
				// 	chosenTags.forEach((tagid) => {
				// 		sporsmalTagService.create(response.data.id, tagid);
				// 	});
				// 	response.data;
				// });
				.then(async (response) => {
					const sporsmalId = response.data.id;

					await Promise.all(
						chosenTags.map((tagId) =>
							sporsmalTagService.create(sporsmalId, tagId)
						)
					);

					return { sporsmalid: sporsmalId, tittel, innhold, chosenTags, poeng };
				})
		);
	}

	delete(sporsmalid: number) {
		return axios
			.delete<Sporsmal>("/sporsmal/" + sporsmalid)
			.then((response) => response.data);
	}

	update(sporsmal: Sporsmal, updateTime: boolean = true, tags?: Tag[]) {
		return (
			axios
				.put<Sporsmal>("/sporsmal", [sporsmal as Sporsmal, updateTime])
				// .then(async (response) => {
				// 	if(tags){
				// 		await sporsmalTagService.getTagForSporsmal(sporsmal.sporsmalid!).then((response: Tag[]) => {
				// 			response.forEach((tag) => {
				// 				sporsmalTagService.delete(sporsmal.sporsmalid!, tag.tagid);
				// 			});
				// 			tags.forEach((tag) => {
				// 				sporsmalTagService.create(sporsmal.sporsmalid!, tag.tagid);
				// 			});
				// 		});
				// 	}
				// 	response.data
				// }); Code er endra for testinga. Om oppdatering feila så bør dette endrast.
				.then(async () => {
					if (tags) {
						await sporsmalTagService
							.getTagForSporsmal(sporsmal.sporsmalid!)
							.then((response: Tag[]) => {
								response.forEach((tag) => {
									sporsmalTagService.delete(sporsmal.sporsmalid!, tag.tagid);
								});

								tags.forEach((tag) => {
									sporsmalTagService.create(sporsmal.sporsmalid!, tag.tagid);
								});
							});
					}

					return sporsmal;
				})
		);
	}
}

const sporsmalService = new SporsmalService();
export default sporsmalService;
