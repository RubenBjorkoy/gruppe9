import express from "express";
import FavorittService from "./favoritt-service";
import { Svar } from "./svar-service";

/**
 * Express router containing favoritt methods.
 */
const router = express.Router();

//fetch all favorited answers
router.get("/favoritt", (_request, response) => {
	FavorittService.getAll()
		.then((svar: Svar[]) => response.send(svar))
		.catch((error: any) => response.status(500).send(error));
});

// Add answerid to favorites
router.post("/favoritt/:svarid", (request, response) => {
	const svarid: Number = Number(request.params.svarid);
	FavorittService.create(svarid)
		.then((id) => response.send({ id: id }))
		.catch((error: any) => {
			if (error === "Already favorited") {
				response.status(409).send(`Svarid "${svarid}" is already favorited`);
			} else if (error === "Answer does not exist") {
				response.status(400).send(`Svarid "${svarid}" does not exist`);
			}
		});
	//response.status(400).send('Missing question title');
});

router.delete("/favoritt/:svarid", (request, response) => {
	const svarid = Number(request.params.svarid);
	FavorittService.delete(svarid)
		.then(() => response.send())
		.catch((error) => {
			response.status(400).send("No row deleted");
		});
});

export default router;
