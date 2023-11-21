import express from "express";
import SporsmalTagService from "./sporsmalTag-service";
import { Tag } from "./tag-service";
import { Sporsmal } from "./sporsmal-service";

/**
 * Express router containing task methods.
 */
const router = express.Router();

//fetch all tags for a question
router.get("/sporsmal/:sporsmalid/tags", (_request, response) => {
	const sporsmalid = Number(_request.params.sporsmalid);
	SporsmalTagService.getTagsForSporsmal(sporsmalid)
		.then((tags: Tag[]) => response.send(tags))
		.catch((error: any) => response.status(500).send(error));
});

router.get("/tag/:tagid/sporsmal", (request, response) => {
	const tagid = Number(request.params.tagid);
	SporsmalTagService.getSporsmalForTags(tagid)
		.then((sporsmal: Sporsmal[]) => response.send(sporsmal))
		.catch((error: any) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
router.post("/sporsmalTag", (request, response) => {
	const data = request.body;
	SporsmalTagService.createRelation(data.sporsmalid, data.tagid)
		.then(() => response.send())
		.catch((error: any) => {
			if (error === "Sporsmal eksisterer ikke") {
				response.status(400).send(error);
			} else if (error === "Tag eksisterer ikke") {
				response.status(400).send(error);
			} else if (error === "Relasjon eksisterer allerede") {
				response.status(400).send(error);
			} else {
				response.status(500).send(error);
			}
		});
	//response.status(400).send('Missing question title');
});

router.delete("/sporsmalTag/:sporsmalid/:tagid", (request, response) => {
	const sporsmalid = Number(request.params.sporsmalid);
	const tagid = Number(request.params.tagid);
	SporsmalTagService.deleteRelation(sporsmalid, tagid)
		.then(() => response.send())
		.catch((error: any) => response.status(500).send(error));
});

export default router;
