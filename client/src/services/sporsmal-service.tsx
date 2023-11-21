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
			// Gammel code. Endret til async pga at testinga feila.
			// .then((response) => {
			// 	chosenTags.forEach((tagid) => {
			// 		sporsmalTagService.create(response.data.id, tagid);
			// 	});
			// 	response.data;
			// });
			.then(async (response) => {
        const sporsmalId = response.data.id;

        // Create tags and associate them with the created spørsmål
        await Promise.all(
          chosenTags.map((tagId) => sporsmalTagService.create(sporsmalId, tagId))
        );

        // Return the created spørsmål
        return { sporsmalid: sporsmalId, tittel, innhold, chosenTags, poeng };
      });
	}

	delete(sporsmalid: number) {
		return axios
			.delete<Sporsmal>("/sporsmal/" + sporsmalid)
			.then((response) => response.data);
	}

	update(sporsmal: Sporsmal, updateTime: boolean = true, tags?: Tag[]) {
		//Add false to the update call to avoid updating time on update. For example when only updating score
		return axios
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
			.then(async (response) => {
        const updatedSporsmal = response.data;

        // If tags are provided, update associated tags
        if (tags) {
          // Delete existing tags
          await sporsmalTagService.getTagForSporsmal(updatedSporsmal.sporsmalid!).then((response: Tag[]) => {
            response.forEach((tag) => {
              sporsmalTagService.delete(updatedSporsmal.sporsmalid!, tag.tagid);
            });

            // Create new tags
            tags.forEach((tag) => {
              sporsmalTagService.create(updatedSporsmal.sporsmalid!, tag.tagid);
            });
          });
        }

        // Return the updated spørsmål
        return updatedSporsmal;
      });
	}
}

const sporsmalService = new SporsmalService();
export default sporsmalService;
