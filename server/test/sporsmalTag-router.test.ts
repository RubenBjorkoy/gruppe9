import axios from "axios";
import pool from "../src/mysql-pool";
import app from "../src/app";
import sporsmalTagService, { SporsmalTag } from "../src/sporsmalTag-service";

const testSporsmalTag: SporsmalTag[] = [
	{
		sporsmalid: 1,
		tagid: 1,
	},
	{
		sporsmalid: 1,
		tagid: 3,
	},
	{
		sporsmalid: 1,
		tagid: 4,
	},
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = "http://localhost:3001/api/v2";

// Start the web server before running tests
let webServer: any;
beforeAll((done) => {
	webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
	// Delete all rows from SporsmalTag table
	pool.query("TRUNCATE TABLE SporsmalTag", (error) => {
		if (error) return done(error);

		// Create a test SporsmalTag
		sporsmalTagService
			.createRelation(testSporsmalTag[0].sporsmalid, testSporsmalTag[0].tagid)
			.then(() =>
				sporsmalTagService.createRelation(
					testSporsmalTag[1].sporsmalid,
					testSporsmalTag[1].tagid
				)
			)
			.then(() =>
				sporsmalTagService.createRelation(
					testSporsmalTag[2].sporsmalid,
					testSporsmalTag[2].tagid
				)
			)
			.then(() => done())
			.catch((error) => done(error));
	});
});

// Stop the web server and close the connection to the MySQL server after running tests
afterAll((done) => {
	if (!webServer) return done(new Error());
	webServer.close(() => pool.end(() => done()));
});

describe("Fetch tags for a question (GET)", () => {
	test("Fetch tags for a question (200 OK)", (done) => {
		axios
			.get(`/sporsmal/${testSporsmalTag[0].sporsmalid}/tags`)
			.then((response) => {
				expect(response.status).toEqual(200);
				expect(response.data.length).toBe(3);
				done();
			});
	});
});

describe("Fetch questions for a tag (GET)", () => {
	test("Fetch questions for a tag (200 OK)", (done) => {
		axios.get(`/tag/${testSporsmalTag[0].tagid}/sporsmal`).then((response) => {
			expect(response.status).toEqual(200);
			expect(response.data.length).toBe(1);
			done();
		});
	});
});

describe("Create SporsmalTag relation (POST)", () => {
	test("Create SporsmalTag relation (200 OK)", (done) => {
		const newSporsmalTag: SporsmalTag = {
			sporsmalid: 4,
			tagid: 4,
		};

		axios.post("/sporsmalTag", newSporsmalTag).then((response) => {
			expect(response.status).toEqual(200);
			done();
		});
	});

	test("Fetch questions for a tag (400 Bad Request)", (done) => {
		const errSporsmalTag = {
			sporsmalid: 99999,
			tagid: 99999,
		};
		axios
			.post(`/sporsmalTag`, errSporsmalTag)
			.then(() => {
				// If the request is successful, fail the test
				done(new Error("Request should have failed with status code 400"));
			})
			.catch((error) => {
				// Check if the error message matches your expected error message
				expect(error.response.status).toEqual(400);
				expect(error.response.data).toEqual("Tag eksisterer ikke");
				done();
			});
	});
});

describe("Delete SporsmalTag relation (DELETE)", () => {
	test("Delete SporsmalTag relation (200 OK)", (done) => {
		axios
			.delete(
				`/sporsmalTag/${testSporsmalTag[0].sporsmalid}/${testSporsmalTag[0].tagid}`
			)
			.then((response) => {
				expect(response.status).toEqual(200);
				done();
			});
	});
});
