/**
 * Queues assessment submissions to IndexedDB when offline.
 * Background Sync API flushes them when connectivity resumes.
 */
import { db } from './db';

export async function queueAssessment(studentId: string, payload: unknown): Promise<void> {
  const store = await db();
  await store.add('assessmentQueue', { studentId, payload, queuedAt: Date.now() });
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    await (reg as any).sync.register('flush-assessments');
  }
}

export async function flushQueue(): Promise<void> {
  const store = await db();
  const all = await store.getAll('assessmentQueue');
  for (const item of all) {
    await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.payload),
    });
  }
  await store.clear('assessmentQueue');
}
