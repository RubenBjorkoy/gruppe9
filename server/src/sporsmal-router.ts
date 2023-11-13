import express from 'express';
import sporsmalService from './sporsmal-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/sporsmal', (_request, response) => {
  sporsmalService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// router.get('/sporsmal/unanswered', (request, response) => {
//   sporsmalService
//     .getUnanswered()
//     .then((rows) => response.send(rows))
//     .catch((error) => response.status(500).send(error));
// });

router.get('/sporsmal/:sporsmalid', (request, response) => {
  const sporsmalid = Number(request.params.sporsmalid);
  sporsmalService
    .get(sporsmalid)
    .then((sporsmal) => (sporsmal ? response.send(sporsmal) : response.status(404).send('Sporsmal not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
router.post('/sporsmal', (request, response) => {
  const data = request.body;
  const now: any = new Date();
  const roundedDate = new Date(Math.floor(now / 1000) * 1000);
  data.dato = new Date(roundedDate);
  data.sistendret = new Date(roundedDate);
  if (data && data.tittel && data.tittel.length != 0) 
    sporsmalService
      .create(data)
      .then((id) => response.send({id}))
      .catch((error) => {response.status(500).send(error)});
  else response.status(400).send('Missing question title');
});

router.put('/sporsmal', (request, response) => {
  const data = request.body
  if (
    typeof data.sporsmalid == 'number' &&
    typeof data.tittel == 'string' &&
    data.tittel.length > 0 &&
    typeof data.innhold == 'string' &&
    data.innhold.length > 0 &&
    typeof data.poeng == 'number'
  ) {
    sporsmalService
      .update(data)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  } else response.status(400).send('Missing task id');
});

router.delete('/sporsmal/:sporsmalid', (request, response) => {
  sporsmalService
    .delete(Number(request.params.sporsmalid))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default router;
