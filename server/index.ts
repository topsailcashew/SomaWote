import express from 'express';
import { curriculumRouter } from './routes/curriculum';
import { assessmentRouter } from './routes/assessment';
import { smsRouter } from './routes/sms';

const app = express();
app.use(express.json());

app.use('/api/curriculum', curriculumRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/sms', smsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`SomaWote API running on :${PORT}`));
