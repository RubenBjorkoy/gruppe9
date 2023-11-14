import express from 'express';
import FavorittService from './favoritt-service';
import { Svar } from './svar-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

//fetch all favorited answers
router.get('/favoritt', (_request, response) => {
    FavorittService
        .getAll()
        .then((svar: Svar[]) => response.send(svar))
        .catch((error: any) => response.status(500).send(error));
});

// Add answerid to favorites
router.post('/favoritt/:svarid', (request, response) => {
    const svarid: Number = Number(request.params.svarid);
    FavorittService
        .create(svarid)
        .then((id) => response.send({id: id}))
        .catch((error: any) => {
            if(error === 'Sporsmal does not exist') {
                response.status(400).send('Sporsmal does not exist');
            } else if(error === 'Tag does not exist') {
                response.status(400).send('Tag does not exist');
            } else if(error === 'Relation already exists') {
                response.status(400).send('Relation already exists');
            } else {
                response.status(500).send(error)
            }
        });
    //response.status(400).send('Missing question title');
});

router.delete('/favoritt/:favorittid', (request, response) => {
    const favid = Number(request.params.favorittid);
    FavorittService
        .delete(favid)
        .then(() => response.send())
        .catch((error: any) => response.status(500).send(error));
});

export default router;
