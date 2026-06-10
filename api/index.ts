/**
 * Vercel serverless entry-point.
 * Re-exports the Express app so Vercel can invoke it as a function.
 */
import express from 'express';
import { curriculumRouter } from '../server/routes/curriculum';
import { assessmentRouter } from '../server/routes/assessment';
import { smsRouter } from '../server/routes/sms';

const app = express();
app.use(express.json());

app.use('/api/curriculum', curriculumRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/sms', smsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
