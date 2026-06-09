import ngrok from '@ngrok/ngrok';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const PORT = process.env.PORT || 8080;
const NGROK_AUTHTOKEN = "3Dn6F2j7kxAgIVnKGjwzJpFi87n_3PWwdA5cBDRkLtUEBF2Sv";
const STATIC_DOMAIN = "unnerving-reawake-starboard.ngrok-free.dev";

// Start the core Express server
console.log('Starting voice-service server...');
const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server.js:', err);
});

serverProcess.on('exit', (code) => {
    console.error(`❌ server.js process exited with code ${code}. Exiting parent process to trigger PM2 restart.`);
    process.exit(code || 1);
});

async function establishTunnel() {
    console.log('Starting Permanent Ngrok Tunnel with SessionBuilder...');
    try {
        // 1. Build and connect the session
        const session = await new ngrok.SessionBuilder()
            .authtoken(NGROK_AUTHTOKEN)
            .handleDisconnection((addr, error) => {
                console.warn(`⚠️  Ngrok session disconnected from ${addr}. Error: ${error}. Retrying connection...`);
                return true; // Return true to attempt reconnection automatically
            })
            .connect();

        console.log('✅ Ngrok session established.');

        // 2. Create the HTTP listener with the reserved static domain
        const listener = await session.httpEndpoint()
            .domain(STATIC_DOMAIN)
            .listen();

        const tunnelUrl = listener.url();
        console.log(`\n🚀 Ngrok Tunnel established securely at: ${tunnelUrl}`);

        // 3. Forward traffic to local server
        await listener.forward(`localhost:${PORT}`);
        console.log(`📡 Forwarding ngrok traffic to localhost:${PORT}`);

        // 4. Update Twilio Webhook (just in case, to ensure it points to the static domain)
        const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const incomingPhoneNumbers = await twilioClient.incomingPhoneNumbers.list({
            phoneNumber: process.env.TWILIO_PHONE_NUMBER
        });

        if (incomingPhoneNumbers.length > 0) {
            const phoneNumberSid = incomingPhoneNumbers[0].sid;
            await twilioClient.incomingPhoneNumbers(phoneNumberSid).update({
                voiceUrl: `${tunnelUrl}/incoming-call`,
                voiceMethod: 'POST'
            });
            console.log(`✅ SUCCESS! Twilio webhook verified and updated to ${tunnelUrl}/incoming-call`);
            console.log(`📞 READY! You can now call the Concierge AI at: ${process.env.TWILIO_PHONE_NUMBER}\n`);
        } else {
            console.error('❌ Could not find Twilio phone number to update.');
        }

        // Cleanup listener on process termination
        const cleanup = async () => {
            console.log("Shutting down tunnel...");
            try {
                serverProcess.kill();
                await listener.close();
                await session.close();
            } catch (err) {
                console.error("Error during cleanup:", err);
            }
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

    } catch (err) {
        console.error('❌ Failed to establish Ngrok tunnel:', err);
        serverProcess.kill();
        process.exit(1);
    }
}

// Give the server a moment to boot up before establishing the tunnel
setTimeout(establishTunnel, 2000);
