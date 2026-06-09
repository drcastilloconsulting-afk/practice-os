import { WebSocket } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${process.env.GEMINI_API_KEY}`;
const ws = new WebSocket(URL);

ws.on('open', () => {
    ws.send(JSON.stringify({
        setup: {
            model: "gemini-2.0-flash"
        }
    }));
});

ws.on('message', (msg) => {
    console.log('Received:', msg.toString());
    ws.close();
});

ws.on('close', (code, reason) => {
    console.log('Closed', code, reason.toString());
});
