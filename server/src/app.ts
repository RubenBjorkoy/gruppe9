import express from 'express';
import sporsmalRouter from './sporsmal-router';
import svarRouter from './svar-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', sporsmalRouter);
app.use('/api/v2', svarRouter);

export default app;
