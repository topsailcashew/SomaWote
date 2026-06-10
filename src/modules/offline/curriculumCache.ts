import { db } from './db';

export async function cacheCurriculum(lessons: { id: string; title: string; content: string }[]): Promise<void> {
  const store = await db();
  for (const lesson of lessons) {
    await store.put('lessons', { ...lesson, cachedAt: Date.now() });
  }
}

export async function getCachedLesson(id: string) {
  const store = await db();
  return store.get('lessons', id);
}
