import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import brukerService, { Bruker } from '../src/bruker-service';

const testUsers: Bruker[] = [
    { brukerid: 1, brukernavn: 'test1', poeng: 0 },
    { brukerid: 2, brukernavn: 'test2', poeng: 2 },
    { brukerid: 3, brukernavn: 'test3', poeng: -2 },
];


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all users, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Bruker', (error) => {
    if (error) return done(error);

    // Create testUsers sequentially in order to set correct id, and call done() when finished
    brukerService
      .create(testUsers[0])
      .then(() => brukerService.create(testUsers[1])) // Create testUsers[1] after testUsers[0] has been created
      .then(() => brukerService.create(testUsers[2])) // Create testUsers[2] after testUsers[1] has been created
      .then(() => done()); // Call done() after testUsers[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
    if (!webServer) return done(new Error());
    webServer.close(() => pool.end(() => done()));
});

describe('Fetch users (GET)', () => {
    test('Fetch all users (200 OK)', (done) => {
        axios.get('/bruker').then((response) => {

        expect(response.status).toEqual(200);
        //expect length of receivedData to be 3, as that is how many answers are in favorites
        expect(response.data.length).toEqual(3);
        done();
        });
    });
});
