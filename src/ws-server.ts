import { WebSocketServer, WebSocket } from "ws";

const HEARTBEAT_INTERVAL_MS = 30_000;

type HeartbeatSocket = WebSocket & { isAlive: boolean };

export function broadcast(wss: WebSocketServer, payload: any) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;

    client.send(JSON.stringify(payload));
  }
}

function sendJson(ws: WebSocket, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export function attachWebSocketToServer(server: any) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    const heartbeatSocket = socket as HeartbeatSocket;
    heartbeatSocket.isAlive = true;

    socket.on("pong", () => {
      heartbeatSocket.isAlive = true;
    });

    sendJson(socket, { type: "connection_established" });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  const heartbeatTimer = setInterval(() => {
    wss.clients.forEach((client) => {
      const socket = client as HeartbeatSocket;

      if (!socket.isAlive) {
        socket.terminate();
        return;
      }

      socket.isAlive = false;
      socket.ping();
    });
  }, HEARTBEAT_INTERVAL_MS);

  wss.on("close", () => {
    clearInterval(heartbeatTimer);
  });

  function broadcastMatchCreated(match: any) {
    broadcast(wss, { type: "match_created", data: match });
  }

  return { broadcastMatchCreated };
}
