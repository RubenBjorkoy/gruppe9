import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import sporsmalService, { Sporsmal } from '../src/sporsmal-service';

const now: any = new Date();
const roundedDate = new Date(Math.floor(now / 1000) * 1000); // Rounds to seconds to account for millisecond delays in creating the questions.

const testQuestions: Sporsmal[] = [
  { sporsmalid: 1, tittel: 'How to create a database schema?', innhold: 'I need help with designing a database schema for my project.', poeng: 10, dato: roundedDate, sistendret: roundedDate },
  { sporsmalid: 2, tittel: 'What are TypeScript interfaces?', innhold: 'I want to understand interfaces in TypeScript. Can someone explain?', poeng: 8, dato: roundedDate, sistendret: roundedDate },
  { sporsmalid: 3, tittel: 'How to use async/await in JavaScript?', innhold: 'I am having trouble understanding asynchronous programming. Any examples?', poeng: 12, dato: roundedDate, sistendret: roundedDate }
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
  pool.query('TRUNCATE TABLE Sporsmal', (error) => {
    if (error) return done(error);

    // Create testQuestions sequentially in order to set correct id, and call done() when finished
    sporsmalService
      .create(testQuestions[0])
      .then(() => sporsmalService.create(testQuestions[1])) // Create testQuestion[1] after testQuestion[0] has been created
      .then(() => sporsmalService.create(testQuestions[2])) // Create testQuestion[2] after testQuestion[1] has been created
      .then(() => done()); // Call done() after testQuestion[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch questions (GET)', () => {
  test('Fetch all questions (200 OK)', (done) => {
    axios.get('/sporsmal').then((response) => {

      const expectedData = JSON.parse(JSON.stringify(testQuestions))
      const receivedData = JSON.parse(JSON.stringify(response.data))

      expect(response.status).toEqual(200);
      expect(receivedData).toEqual(expectedData);
      done();
    });
  });

  test('Fetch question (200 OK)', (done) => {
    axios.get('/sporsmal/1').then((response) => {

      const expectedData = JSON.parse(JSON.stringify(testQuestions))
      const receivedData = JSON.parse(JSON.stringify(response.data))

      expect(response.status).toEqual(200);
      expect(receivedData).toEqual(expectedData[0]);
      done();
    });
  });

  test('Fetch question (404 Not Found)', (done) => { //Working
    axios
      .get('/sporsmal/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new question (POST)', () => {
  test('Create new question (200 OK)', (done) => {
    const now: any = new Date();
    const roundedDate = new Date(Math.floor(now / 1000) * 1000);
    const testQuestion: Sporsmal = {
      //sporsmalid: 4, 
      tittel: 'How to create a new question?', 
      innhold: 'I need help with creating a question for this test', 
      poeng: 1, 
      dato: roundedDate, 
      sistendret: roundedDate 
    }
    
    axios.post('/sporsmal', { sporsmal: testQuestion }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({id: 4});
      done();
    });
  })
});

describe('Update question (POST)', () => {
  test('Update question (200 OK)', (done) => {
    const testQuestion: Sporsmal = testQuestions[2];
    const updatedPoeng = testQuestion.poeng+1;
    testQuestion.poeng = updatedPoeng;
    
    
    axios.put('/sporsmal', { sporsmal: testQuestion }).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  })
});

describe('Delete question (DELETE)', () => {
  test('Delete question (200 OK)', (done) => {
    axios.delete('/sporsmal/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
