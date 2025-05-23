import { Server } from 'ws';

const rooms = new Map();

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const wss = new Server({ noServer: true });

  res.socket.server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const roomName = url.searchParams.get('room');

    wss.handleUpgrade(req, socket, head, ws => {
      if (!rooms.has(roomName)) rooms.set(roomName, new Set());

      rooms.get(roomName).add(ws);
      ws.on('message', msg => {
        for (const client of rooms.get(roomName)) {
          if (client !== ws && client.readyState === 1) {
            client.send(`[${roomName}] ${msg}`);
          }
        }
      });

      ws.on('close', () => {
        const clients = rooms.get(roomName);
        clients.delete(ws);
        if (clients.size === 0) rooms.delete(roomName);
      });
    });
  });

  res.socket.server.io = true;
  res.end();
}
