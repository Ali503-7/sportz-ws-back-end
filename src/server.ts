import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    broadcastMessage(`New message from client: ${message}`);
  });

  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send("New client connected");
    }
  });

  console.log("Client connected on url ws://localhost:8080");
});

function broadcastMessage(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
