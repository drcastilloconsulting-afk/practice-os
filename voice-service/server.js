import express from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import dotenv from 'dotenv';
import twilio from 'twilio';
import alawmulaw from 'alawmulaw';
const { mulaw } = alawmulaw;

dotenv.config();

// Standard Express setup with WebSocket support
const app = express();
expressWs(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// System Prompt for our regenerative medicine concierge
const SYSTEM_PROMPT = `
You are the AI Concierge for PracticeOS Regenerative Medicine Clinic.
Your voice is warm, empathetic, and highly professional.
Speak in short, conversational sentences. Never give medical advice.

Your primary goal is to perform a highly empathetic patient intake before attempting to book them or ask for money. 
Follow this exact conversational flow:
1. Greet the caller and warmly ask what they are currently struggling with regarding their health.
2. Listen carefully to their symptoms. Express genuine empathy and validation (e.g., "I am so sorry you've been dealing with that, but you've called the right place.").
3. Ask 1 or 2 specific follow-up questions to understand the severity or duration of their symptoms (e.g., "How long has the fatigue been affecting your daily life?").
4. Reassure them that Dr. Castillo specializes in exactly these types of complex regenerative cases.
5. Only AFTER you have made them feel completely understood, explain that the next step is an Initial Consult to build a custom regenerative protocol. 
6. Explain that the Initial Consult requires a $250 deposit to secure the calendar slot, and ask if they are ready to book.
`;

// Define the Function Calling "Tools" for Gemini
const TOOLS_DECLARATION = [
    {
        functionDeclarations: [
            {
                name: "check_calendar",
                description: "Checks PracticeOS for available appointment slots and retrieves pricing and the required deposit for a specific visit type.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        preferred_date: { type: "STRING", description: "The preferred date in YYYY-MM-DD format" },
                        visit_type: { type: "STRING", description: "Type of visit, e.g., 'Initial Consult' or 'Bloodwork'" }
                    },
                    required: ["preferred_date", "visit_type"]
                }
            },
            {
                name: "save_intake_notes",
                description: "Creates an initial patient profile in PracticeOS with their contact details and symptoms.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        first_name: { type: "STRING" },
                        last_name: { type: "STRING" },
                        email: { type: "STRING" },
                        phone_number: { type: "STRING" },
                        symptoms: { type: "STRING", description: "Detailed notes on what the patient is experiencing" }
                    },
                    required: ["first_name", "last_name", "phone_number"]
                }
            },
            {
                name: "process_stripe_payment",
                description: "Securely processes the upfront deposit over the phone using the Stripe API.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        card_number: { type: "STRING" },
                        exp_month: { type: "STRING" },
                        exp_year: { type: "STRING" },
                        cvc: { type: "STRING" },
                        deposit_amount: { type: "INTEGER", description: "The 50% deposit amount to charge" }
                    },
                    required: ["card_number", "exp_month", "exp_year", "cvc", "deposit_amount"]
                }
            }
        ]
    }
];

/**
 * 1. Twilio Webhook (POST):
 * When a user calls your Twilio number, Twilio hits this endpoint.
 * We return a TwiML response telling Twilio to open a WebSocket stream to our server.
 */
app.post('/incoming-call', (req, res) => {
    console.log('[Twilio] Incoming call received! Connecting stream...');
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    // Connect the call to our WebSocket endpoint for bi-directional audio
    const connect = twiml.connect();
    connect.stream({
        url: `wss://${req.headers.host}/stream`
    });

    res.type('text/xml');
    res.send(twiml.toString());
});

/**
 * 2. Twilio Media Stream Endpoint (WebSocket)
 * Twilio connects here and starts sending the live audio.
 */
app.ws('/stream', (twilioWs, req) => {
    let streamSid = null;
    let geminiWs = null;

    console.log('[Twilio] New Connection established');

    // 3. Connect to Gemini Multimodal Live API
    const setupGeminiConnection = () => {
        const HOST = "generativelanguage.googleapis.com";
        const MODEL = "models/gemini-2.5-flash-native-audio-latest";
        const URL = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;
        
        geminiWs = new WebSocket(URL);

        geminiWs.on('open', () => {
            console.log('[Gemini] Connected to Live API');
            
            // Send initial setup frame with System Instructions, Voice Config, and Tools
            const setupMessage = {
                setup: {
                    model: MODEL,
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    tools: TOOLS_DECLARATION,
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: "Kore" } // Warm, welcoming, younger female voice
                            }
                        }
                    }
                }
            };
            geminiWs.send(JSON.stringify(setupMessage));

            // Force Gemini to speak first by sending an initial prompt
            // We use a 1.5s delay to ensure the Twilio WebRTC audio bridge is fully open 
            // so the patient doesn't miss the first word of the greeting.
            setTimeout(() => {
                const initialGreeting = {
                    clientContent: {
                        turns: [{
                            role: "user",
                            parts: [{ 
                                text: "The call has just connected. Please warmly greet the caller as the front desk concierge of PracticeOS Regenerative Medicine Clinic, and ask how you can help them today." 
                            }]
                        }],
                        turnComplete: true
                    }
                };
                if (geminiWs.readyState === WebSocket.OPEN) {
                    geminiWs.send(JSON.stringify(initialGreeting));
                }
            }, 1500);
        });

        geminiWs.on('message', (data) => {
            let response;
            try {
                response = JSON.parse(data);
            } catch (e) {
                console.log('[Gemini] Non-JSON message received:', data);
                return;
            }
            
            // Check for explicit error from Gemini
            if (response.error) {
                console.error('[Gemini] ERROR response:', response.error);
            }

            // Handle Server Content (Audio or Function Calls back from Gemini)
            if (response.serverContent?.modelTurn?.parts) {
                const parts = response.serverContent.modelTurn.parts;
                for (const part of parts) {
                    
                    // 1. Audio Payload Handling
                    if (part.inlineData && part.inlineData.data) {
                        const base64Audio = part.inlineData.data;

                        // Decode Base64 24kHz PCM16 from Gemini
                        const pcmBuffer = Buffer.from(base64Audio, 'base64');
                        const pcm24kHzSamples = new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, pcmBuffer.length / 2);

                        // Downsample from 24kHz to 8kHz by taking every 3rd sample
                        const pcm8kHzSamples = new Int16Array(Math.floor(pcm24kHzSamples.length / 3));
                        for (let i = 0; i < pcm8kHzSamples.length; i++) {
                            pcm8kHzSamples[i] = pcm24kHzSamples[i * 3];
                        }

                        // Encode PCM16 8kHz to µ-law
                        const mulawBuffer = mulaw.encode(pcm8kHzSamples);
                        const base64Mulaw = Buffer.from(mulawBuffer).toString('base64');

                        // Send audio back to Twilio (must be wrapped in a 'media' event payload)
                        if (streamSid) {
                            const mediaMessage = {
                                event: 'media',
                                streamSid: streamSid,
                                media: {
                                    payload: base64Mulaw
                                }
                            };
                            twilioWs.send(JSON.stringify(mediaMessage));
                        }
                    }
                }
            }

            // 2. Function Call Handling (The Concierge requested data or action!)
            if (response.toolCall) {
                for (const call of response.toolCall.functionCalls) {
                    const { id, name, args } = call;
                    console.log(`\n[Gemini Tool Called] -> ${name}`);
                    console.log(`Arguments Provided:`, args);

                    let simulatedResult = {};
                    if (name === "check_calendar") {
                        simulatedResult = { status: "Success", slots_available: ["2:00 PM Tuesday", "9:00 AM Wed"], visit_total_price: 500, deposit_due: 250 };
                    } else if (name === "save_intake_notes") {
                        simulatedResult = { status: "Profile Created", patient_id: "PT-777" };
                    } else if (name === "process_stripe_payment") {
                        simulatedResult = { status: "Payment Successful", receipt_id: "ch_xyz987" };
                    }

                    // Send the result explicitly back to the model websocket
                    const functionResponsePayload = {
                        toolResponse: {
                            functionResponses: [{
                                id: id,
                                name: name,
                                response: { result: simulatedResult }
                            }]
                        }
                    };
                    geminiWs.send(JSON.stringify(functionResponsePayload));
                }
            }
        });

        geminiWs.on('close', (code, reason) => {
            const msg = reason?.toString() || '(no reason)';
            console.log(`[Gemini] Connection closed. Code: ${code}, Reason: ${msg}`);
            if (code !== 1000) {
                console.error(`[Gemini] UNEXPECTED CLOSE — code ${code}: ${msg}`);
            }
        });
        
        geminiWs.on('error', (err) => {
            console.error('[Gemini] Error:', err);
        });
    };

    setupGeminiConnection();

    // 4. Handle incoming messages from Twilio
    twilioWs.on('message', (message) => {
        let msg;
        try {
            msg = JSON.parse(message);
        } catch (e) {
            console.error('[Twilio] Error parsing message JSON:', e);
            return;
        }

        if (msg.event === 'start') {
            streamSid = msg.start.streamSid;
            console.log(`[Twilio] Stream Started: ${streamSid}`);
        } else if (msg.event === 'media') {
            // Forward audio payload from Twilio to Gemini
            const b64Audio = msg.media.payload;

            // Decode Twilio's Base64 8kHz µ-law into Buffer
            const mulawBufferIn = Buffer.from(b64Audio, 'base64');
            
            // Decode µ-law to PCM16 Int16Array
            const pcmSamples = mulaw.decode(mulawBufferIn); 
            
            // Upsample from 8kHz to 16kHz by simply duplicating each sample
            const pcm16kHzSamples = new Int16Array(pcmSamples.length * 2);
            for (let i = 0; i < pcmSamples.length; i++) {
                pcm16kHzSamples[i * 2] = pcmSamples[i];
                pcm16kHzSamples[i * 2 + 1] = pcmSamples[i]; // duplicate
            }
            
            // Convert back to Base64 to send to Gemini
            const pcm16kHzBuffer = Buffer.from(pcm16kHzSamples.buffer, pcm16kHzSamples.byteOffset, pcm16kHzSamples.byteLength);
            const base64Pcm = pcm16kHzBuffer.toString('base64');

            if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
                const clientContent = {
                    realtimeInput: {
                        mediaChunks: [{
                            mimeType: "audio/pcm;rate=16000",
                            data: base64Pcm
                        }]
                    }
                };
                geminiWs.send(JSON.stringify(clientContent));
            }
        } else if (msg.event === 'stop') {
            console.log(`[Twilio] Stream Stopped`);
            if (geminiWs) geminiWs.close();
        }
    });

    twilioWs.on('error', (err) => {
        console.error('[Twilio] WebSocket error occurred:', err);
        if (geminiWs) geminiWs.close();
    });

    twilioWs.on('close', () => {
        console.log('[Twilio] Connection closed');
        if (geminiWs) geminiWs.close();
    });
});

app.listen(PORT, async () => {
    console.log(`🚀 PracticeOS Voice Microservice running on port ${PORT}`);
    console.log(`Ensure your Twilio URL points to POST /incoming-call and WS /stream`);

    // ── Gemini Live API health check ────────────────────────────────────────────
    // Tests an actual WebSocket connection to the Live API (more reliable than
    // querying the models list, which sometimes lags behind real availability).
    try {
        await new Promise((resolve, reject) => {
            const testWs = new WebSocket(
                `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`
            );
            const timeout = setTimeout(() => { testWs.terminate(); reject(new Error('timeout')); }, 8000);
            testWs.on('open', () => {
                testWs.send(JSON.stringify({
                    setup: { model: 'models/gemini-2.5-flash-native-audio-latest', generationConfig: { responseModalities: ['AUDIO'] } }
                }));
            });
            testWs.on('message', (data) => {
                const msg = JSON.parse(data.toString());
                if (msg.setupComplete !== undefined) {
                    clearTimeout(timeout);
                    testWs.close();
                    resolve();
                }
            });
            testWs.on('error', (e) => { clearTimeout(timeout); reject(e); });
            testWs.on('close', (code, reason) => {
                if (code !== 1000 && code !== 1001) {
                    clearTimeout(timeout);
                    reject(new Error(`WS closed ${code}: ${reason}`));
                }
            });
        });
        console.log('✅ Gemini Live API OK — model ready, WebSocket confirmed');
    } catch (e) {
        console.error('⚠️  WARNING: Gemini Live API health check failed:', e.message);
        console.error('   Calls may fail. Check API key/quota at aistudio.google.com');
    }

});
