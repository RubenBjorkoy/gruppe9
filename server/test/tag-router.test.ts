import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import tagService, { Tag } from '../src/tag-service';


const testQuestions: Tag[] = [
  { tagid: 1, navn: 'Javascript', forklaring: 'A Language'},
  { tagid: 2, navn: 'Python', forklaring: 'A Language'},
  { tagid: 3, navn: 'Java', forklaring: 'A Language'},
  { tagid: 4, navn: 'PHP', forklaring: 'A Language'}
];


// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3003/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3003, () => done());
});

beforeEach((done) => {
  // Delete all questions, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Tag', (error) => {
    if (error) return done(error);

    // Create testQuestions sequentially in order to set correct id, and call done() when finished
    tagService
      .create(testQuestions[0])
      .then(() => tagService.create(testQuestions[1])) // Create testQuestion[1] after testQuestion[0] has been created
      .then(() => tagService.create(testQuestions[2])) // Create testQuestion[2] after testQuestion[1] has been created
      .then(() => tagService.create(testQuestions[3])) // Create testQuestion[3] after testQuestion[2] has been created
      .then(() => done()); // Call done() after testQuestion[3] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch questions (GET)', () => {
  test('Fetch all questions (200 OK)', (done) => {
    axios.get('/tag').then((response) => {

      const expectedData = JSON.parse(JSON.stringify(testQuestions))
      const receivedData = JSON.parse(JSON.stringify(response.data))

      expect(response.status).toEqual(200);
      expect(receivedData).toEqual(expectedData);
      done();
    });
  });

  test('Fetch question (200 OK)', (done) => {
    axios.get('/tag/1').then((response) => {

      const expectedData = JSON.parse(JSON.stringify(testQuestions))
      const receivedData = JSON.parse(JSON.stringify(response.data))

      expect(response.status).toEqual(200);
      expect(receivedData).toEqual(expectedData[0]);
      done();
    });
  });

  test('Fetch question (404 Not Found)', (done) => { //Working
    axios
      .get('/tag/5')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new question (POST)', () => {
  test('Create new question (200 OK)', (done) => {
    const testQuestion: Tag = {
      //sporsmalid: 5, 
      navn: 'C', 
      forklaring: 'A language'
    }
    
    axios.post('/tag', testQuestion).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({id: 5});
      done();
    });
  });
});

describe('Update question (POST)', () => {
  test('Update question (200 OK)', (done) => {
    const testQuestion: Tag = testQuestions[2];
    testQuestion.navn = 'C++';
    
    
    axios.put('/tag', testQuestion ).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  })
});

describe('Delete question (DELETE)', () => {
  test('Delete question (200 OK)', (done) => {
    axios.delete('/tag/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
