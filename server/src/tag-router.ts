import express from 'express';
import tagService from './tag-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/tag', (_request, response) => {
    tagService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/tag/:tagid', (request, response) => {
  const tagid = Number(request.params.tagid);
  tagService
    .get(tagid)
    .then((sporsmal) => (sporsmal ? response.send(sporsmal) : response.status(404).send('Sporsmal not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
router.post('/tag', (request, response) => {
  const data = request.body;
  tagService
      .create(data)
      .then((id) => response.send({id}))
      .catch((error) => {response.status(500).send(error)});
  //response.status(400).send('Missing question title');
});

router.put('/tag', (request, response) => {
  const data = request.body
    tagService
      .update(data)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  //response.status(400).send('Missing task id');
});

router.delete('/tag/:tagid', (request, response) => {
    tagService
    .delete(Number(request.params.tagid))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default router;
