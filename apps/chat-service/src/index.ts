import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'chat-service' });
});

io.on('connection', (socket) => {
  console.log(`[Chat-Service] Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Chat-Service] Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`[Chat-Service] Running on port ${PORT}`);
});
