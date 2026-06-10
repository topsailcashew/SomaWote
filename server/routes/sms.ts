import { Router } from 'express';
import { parseSmsQuery, buildSmsReply } from '../lib/smsGateway';

export const smsRouter = Router();

// POST /api/sms/inbound — Selcom/Beem webhook
smsRouter.post('/inbound', async (req, res) => {
  const { from, text } = req.body;
  const intent = parseSmsQuery(text);
  const reply = await buildSmsReply(intent);
  // TODO: send reply via Selcom API — smsGateway.send(from, reply)
  res.json({ reply });
});
