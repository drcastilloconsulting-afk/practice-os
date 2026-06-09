import ngrok from '@ngrok/ngrok';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const PORT = process.env.PORT || 8080;

// Start the core Express server
console.log('Starting voice-service server...');
const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

serverProcess.on('error', (err) => {
    console.error('Failed to start server.js:', err);
});

async function establishTunnel() {
    console.log('Starting Permanent Ngrok Tunnel...');
    try {
        // Create an ngrok tunnel using the exact authtoken
        const listener = await ngrok.forward({ addr: PORT, authtoken: "3Dn6F2j7kxAgIVnKGjwzJpFi87n_3PWwdA5cBDRkLtUEBF2Sv" });
        const tunnelUrl = listener.url();
        console.log(`\nTunnel established securely at: ${tunnelUrl}`);

        // Update Twilio Webhook
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
            console.log(`✅ SUCCESS! Twilio webhook updated to ${tunnelUrl}/incoming-call`);
            console.log(`📞 READY! You can now call the Concierge AI at: ${process.env.TWILIO_PHONE_NUMBER}\n`);
        } else {
            console.error('❌ Could not find Twilio phone number to update.');
        }

    } catch (err) {
        console.error('❌ Failed to establish Ngrok tunnel:', err);
    }
}

// Give the server a moment to boot up before establishing the tunnel
setTimeout(establishTunnel, 2000);

// Ensure proper cleanup when pm2 restarts or stops the process
process.on('SIGINT', async () => {
    console.log("Shutting down...");
    serverProcess.kill();
    await ngrok.disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log("Shutting down...");
    serverProcess.kill();
    await ngrok.disconnect();
    process.exit(0);
});
