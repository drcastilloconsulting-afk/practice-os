import WebSocket from 'ws';

const ws = new WebSocket('wss://practice-os.onrender.com/stream');

ws.on('open', () => {
    console.log('Connected to Render WebSocket');
    ws.send(JSON.stringify({
        event: 'start',
        start: { streamSid: 'MZ1234567890' }
    }));
});

ws.on('message', (msg) => {
    console.log('Received:', msg.toString());
});

ws.on('close', (code, reason) => {
    console.log('Closed', code, reason.toString());
});

ws.on('error', (err) => {
    console.error('Error:', err);
});
