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

router.get('/tasks/:id', (request, response) => {
  const id = Number(request.params.id);
  sporsmalService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
router.post('/tasks', (request, response) => {
  const data = request.body;
  if (data && data.title && data.title.length != 0)
  sporsmalService
      .create(data.title)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing task title');
});

router.put('/tasks', (request, response) => {
  const { sporsmalid, tittel, innhold, poeng, dato, sistendret } = request.body;
  if (
    typeof sporsmalid == 'number' &&
    typeof tittel == 'string' &&
    tittel.length > 0 &&
    typeof innhold == 'string' &&
    innhold.length > 0 &&
    typeof poeng == 'number'
  ) {
    sporsmalService
      .update({ sporsmalid, tittel, innhold, poeng, dato, sistendret })
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  } else response.status(400).send('Missing task id');
});

router.delete('/tasks/:id', (request, response) => {
  sporsmalService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default router;
