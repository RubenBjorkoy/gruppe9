import express from 'express';
import brukerService, { Bruker } from './bruker-service';

/**
 * Express router containing favoritt methods.
 */
const router = express.Router();

router.get('/bruker', (_request, response) => {
    brukerService.getAll()
        .then((bruker: Bruker[]) => response.send(bruker))
        .catch((error: any) => response.status(500).send(error));
})

export default router;