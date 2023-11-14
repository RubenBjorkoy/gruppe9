import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import favorittService from '../src/favoritt-service';
import * as favorittServiceModule from '../src/favoritt-service';

type Favoritt = {
    favorittid?: number;
    svarid: number;
};

const testFavorites: Favoritt[] = [
  { svarid: 1 },
  { svarid: 3 }
];


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all questions, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Favoritter', (error) => {
    if (error) return done(error);

    // Create testQuestions sequentially in order to set correct id, and call done() when finished
    favorittService
      .create(testFavorites[0].svarid)
      .then(() => favorittService.create(testFavorites[1].svarid)) // Create testQuestion[1] after testQuestion[0] has been created
      .then(() => done()); // Call done() after testQuestion[1] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
    if (!webServer) return done(new Error());
    webServer.close(() => pool.end(() => done()));
});

describe('Fetch favorites (GET)', () => {
    test('Fetch all favorite answers (200 OK)', (done) => {
        axios.get('/favoritt').then((response) => {

        const expectedData = JSON.parse(JSON.stringify(testFavorites))
        const receivedData = JSON.parse(JSON.stringify(response.data))

        expect(response.status).toEqual(200);
        //expect length of receivedData to be 3, as that is how many answers are in favorites
        expect(receivedData.length).toEqual(2);
        done();
        });
    });
});

describe('Create new favorite (POST)', () => {
  test('Create new favorite (200 OK)', (done) => {
    const testFav: Favoritt = { svarid: 4 };
    
    axios.post(`/favoritt/${testFav.svarid}`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({id: 3}); //Favorite id should be 4, as 3 favorites already exist
      done();
    });
  });

  test('Create new favorite (409 Conflict)', (done) => {
    const testFav: Favoritt = { svarid: 1 };
    
    axios.post(`/favoritt/${testFav.svarid}`).then((_response) => done(new Error()))
    .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 409');
        done();
    });
  });

  test('Create new favorite (400 Bad request)', (done) => {
    const testFav: Favoritt = { svarid: 8 };
    
    axios.post(`/favoritt/${testFav.svarid}`).then((_response) => done(new Error()))
    .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
    });
  });
});

describe('Delete question (DELETE)', () => {
    test('Delete question (200 OK)', (done) => {
        axios.delete(`/favoritt/2`).then((response) => {
            expect(response.status).toEqual(200);
            done();
        });
    });

    test('Delete question (400 Bad request)', (done) => {
        axios.delete(`/favoritt/9`).then((response) => {
            expect(response.status).toEqual(400);
        })
        .catch((error) => {
            expect(error.message).toEqual('Request failed with status code 400');
            done();
        });
    });
});
