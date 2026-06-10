import { Router } from 'express';
import { prisma } from '../lib/prismaClient';

export const curriculumRouter = Router();

// GET /api/curriculum/lessons?grade=1&subject=LITERACY
curriculumRouter.get('/lessons', async (req, res) => {
  const { grade, subject } = req.query;
  const lessons = await prisma.lesson.findMany({
    where: {
      ...(grade ? { grade: String(grade) } : {}),
      ...(subject ? { subject: String(subject).toUpperCase() as any } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ lessons });
});

// GET /api/curriculum/lessons/:id
curriculumRouter.get('/lessons/:id', async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id } });
  if (!lesson) return res.status(404).json({ error: 'Not found' });
  res.json({ lesson });
});
