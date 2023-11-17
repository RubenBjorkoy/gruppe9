import axios from "axios";
import { Sporsmal } from "./sporsmal-service";
import { Tag } from "./tag-service";

axios.defaults.baseURL = "http://localhost:3000/api/v2";

class SporsmalTagService {
	getTagForSporsmal(sporsmalid: number) {
		return axios
			.get<Tag[]>(`/sporsmal/${sporsmalid}/tags`)
			.then((response) => response.data);
	}

	getSporsmalForTags(tagid: number) {
		return axios
			.get<Sporsmal[]>(`/tag/${tagid}/sporsmal`)
			.then((response) => response.data);
	}

	create(sporsmalid: number, tagid: number) {
		return axios
			.post<{ tag: Tag }>("/sporsmalTag/", {
				sporsmalid: sporsmalid,
				tagid: tagid,
			})
			.then((response) => response.data);
	}

	delete(sporsmalid: number, tagid: number) {
		return axios
			.delete<Sporsmal>(`/sporsmal/${sporsmalid}/${tagid}`)
			.then((response) => response.data);
	}
}

const sporsmalTagService = new SporsmalTagService();
export default sporsmalTagService;
