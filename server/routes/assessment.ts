import { Router } from 'express';
import { prisma } from '../lib/prismaClient';

export const assessmentRouter = Router();

// POST /api/assessments — accepts queued EASE screening submissions
assessmentRouter.post('/', async (req, res) => {
  const { studentId, responses, score } = req.body;
  if (!studentId || !responses) return res.status(400).json({ error: 'studentId and responses required' });
  const result = await prisma.assessmentResult.create({
    data: { studentId, responses, score: score ?? null },
  });
  res.status(202).json({ queued: true, id: result.id, studentId });
});

// GET /api/assessments/:studentId
assessmentRouter.get('/:studentId', async (req, res) => {
  const results = await prisma.assessmentResult.findMany({
    where: { studentId: req.params.studentId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ results });
});
