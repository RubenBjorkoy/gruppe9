import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import svarService, { Svar } from '../src/svar-service';

const now: any = new Date();
const roundedDate = new Date(Math.floor(now / 1000) * 1000); // Rounds to seconds to account for millisecond delays in creating the questions.

const testAnswers: Svar[] = [
  { svarid: 1, svartekst: 'Create a new database schema in MySQL Workbench.', poeng: 2,  sporsmalid: 1, dato: roundedDate, sistendret: roundedDate, ersvar: false, svarsvarid: null },
  { svarid: 2, svartekst: 'Interfaces in TypeScript are similar to interfaces in Java and C#. They are used for strongly typing objects.', poeng: 1, sporsmalid: 2, dato: roundedDate, sistendret: roundedDate, ersvar: false, svarsvarid: null },
  { svarid: 3, svartekst: 'Async/await is syntactic sugar for promises in JavaScript. It makes asynchronous programming easier to understand and write.', poeng: 3, sporsmalid: 3, dato: roundedDate, sistendret: roundedDate, ersvar: false, svarsvarid: null },
  { svarid: 4, svartekst: "I really don't know either", poeng: -1,  sporsmalid: 1, dato: roundedDate, sistendret: roundedDate, ersvar: false, svarsvarid: null }
];


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3002/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  // Use setTimeout to ensure that sporsmal tests finish before starting svar tests
  //setTimeout(() => {
    webServer = app.listen(3002, () => done());
  //}, 1000);
});

beforeEach((done) => {
  // Delete all questions, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Svar', (error) => {
    if (error) return done(error);

    // Create testAnswers sequentially in order to set correct id, and call done() when finished
    svarService
      .create(testAnswers[0])
      .then(() => svarService.create(testAnswers[1])) // Create testAnswer[1] after testAnswer[0] has been created
      .then(() => svarService.create(testAnswers[2])) // Create testAnswer[2] after testAnswer[1] has been created
      .then(() => svarService.create(testAnswers[3])) // Create testAnswer[3] after testAnswer[2] has been created
      .then(() => done()); // Call done() after testAnswer[3] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch Comments (GET)', () => {
  test('Fetch comment to a post (200 OK)', (done) => {
      axios.get('/sporsmal/1/svar/1').then((response) => {
        const expectedData = JSON.parse(JSON.stringify(testAnswers))
        const receivedData = JSON.parse(JSON.stringify(response.data))
  
        expect(response.status).toEqual(200);
        expect(receivedData).toEqual(expectedData[0]);
        done();
    });
  });

  test('Fetch all comments to a post (200 OK)', (done) => {
      axios.get('/sporsmal/1/svar').then((response) => {
        const expectedData = JSON.parse(JSON.stringify(testAnswers.filter((answer) => answer.sporsmalid === 1)))
        const receivedData = JSON.parse(JSON.stringify(response.data))
  
        expect(response.status).toEqual(200);
        expect(receivedData).toEqual(expectedData);
        done();
    });
  });

  test('Fetch comment (404 Not Found)', (done) => { //Working
    axios
      .get('/sporsmal/1/svar/2')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new comment (POST)', () => {
  test('Create new comment (200 OK)', (done) => {
    const now: any = new Date();
    const roundedDate = new Date(Math.floor(now / 1000) * 1000);
    const testAnswer: Svar = {
      //svarid: 5, 
      svartekst: 'How to create a new comment?', 
      poeng: 1, 
      sporsmalid: 1, 
      dato: roundedDate, 
      sistendret: roundedDate,
      ersvar: false,
      svarsvarid: null
    }
    
    axios.post(`/sporsmal/1/svar`, { svar: testAnswer }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({id: 5});
      done();
    });
  })
});

describe('Update comment (POST)', () => {
  test('Update comment (200 OK)', (done) => {
    const testAnswer: Svar = testAnswers[2];
    const updatedPoeng = testAnswer.poeng+1;
    testAnswer.poeng = updatedPoeng;
    
    
    axios.put(`/sporsmal/${testAnswer.sporsmalid}/svar`, { svar: testAnswer }).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  })
});

describe('Delete comment (DELETE)', () => {
  test('Delete comment (200 OK)', (done) => {
    axios.delete('/sporsmal/3/svar/3').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Delete comment with a reply (200 OK)', (done) => {
    const testAnswer: Svar = {
      //svarid: 5, 
      svartekst: 'How to create a new comment?', 
      poeng: 1, 
      sporsmalid: 1, 
      dato: roundedDate, 
      sistendret: roundedDate,
      ersvar: false,
      svarsvarid: null
    }
    const testReply: Svar = {
      //svarid: 6, 
      svartekst: 'This is how I reply at least.', 
      poeng: 1, 
      sporsmalid: 1, 
      dato: roundedDate, 
      sistendret: roundedDate,
      ersvar: true,
      svarsvarid: 5
    }

    svarService.create(testAnswer).then((id) => {
      testReply.svarsvarid = id;
      svarService.create(testReply).then((id) => {
        axios.delete(`/sporsmal/${testAnswer.sporsmalid}/svar/${testReply.svarsvarid}`).then((response) => {
          expect(response.status).toEqual(200);
          done();
        });
      });
    });
  });
});
