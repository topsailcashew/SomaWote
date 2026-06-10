/**
 * Makini SMS — parses inbound keyword queries and builds curriculum replies
 * within SMS character limits (~160 chars per segment).
 */

export type SmsIntent =
  | { type: 'lesson'; subject: string; grade: string }
  | { type: 'quiz'; subject: string }
  | { type: 'unknown' };

export function parseSmsQuery(text: string): SmsIntent {
  const t = text.trim().toUpperCase();
  if (t.startsWith('SOMA')) {
    const [, subject, grade] = t.split(' ');
    return { type: 'lesson', subject: subject ?? 'LITERACY', grade: grade ?? '1' };
  }
  if (t.startsWith('JARIBIO')) {
    const [, subject] = t.split(' ');
    return { type: 'quiz', subject: subject ?? 'LITERACY' };
  }
  return { type: 'unknown' };
}

export async function buildSmsReply(intent: SmsIntent): Promise<string> {
  if (intent.type === 'unknown') {
    return 'Karibu! Tuma SOMA KUSOMA 1 kupata somo la kusoma. Tuma JARIBIO HESABU kwa mtihani.';
  }

  // Lazy import so the module can be imported without a live DB (e.g. in tests)
  const { prisma } = await import('./prismaClient');

  if (intent.type === 'lesson') {
    const lesson = await prisma.lesson.findFirst({
      where: { subject: intent.subject.toUpperCase() as any, grade: intent.grade },
      orderBy: { createdAt: 'desc' },
    });
    if (!lesson) return `Hakuna somo la ${intent.subject} darasa ${intent.grade} bado.`;
    // Truncate to fit within a single 160-char SMS segment
    const title = lesson.title.slice(0, 60);
    const snippet = typeof lesson.content === 'string'
      ? (lesson.content as string).slice(0, 90)
      : JSON.stringify(lesson.content).slice(0, 90);
    return `${title}: ${snippet}`.slice(0, 155) + '…';
  }

  if (intent.type === 'quiz') {
    const lesson = await prisma.lesson.findFirst({
      where: { subject: intent.subject.toUpperCase() as any },
      orderBy: { createdAt: 'desc' },
    });
    if (!lesson) return `Hakuna maswali ya ${intent.subject} bado.`;
    return `Swali: Nini unajua kuhusu ${lesson.title}? Jibu kwa ujumbe mfupi.`.slice(0, 160);
  }

  return 'Ombi halikueleweka.';
}
