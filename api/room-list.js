export const config = { api: { bodyParser: false } };
import { rooms } from './socket';

export default function handler(req, res) {
  res.json({ rooms: [...rooms.keys()] });
}
