export const config = { api: { bodyParser: true } };
import { rooms } from '../socket';

export default async function handler(req, res) {
  const { room } = req.query;
  const { message } = req.body;

  const clients = rooms.get(room);
  if (!clients || clients.size === 0) {
    return res.status(404).json({ error: 'Room not found or empty' });
  }

  for (const ws of clients) {
    if (ws.readyState === 1) {
      ws.send(`[${room}] ${message}`);
    }
  }

  res.json({ success: true });
}
