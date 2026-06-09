import { spawn } from 'child_process';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

console.log('Starting voice-service server...');
const server = spawn('node', ['server.js'], { stdio: 'inherit' });

console.log('Starting Pinggy Tunnel (more stable than Cloudflare)...');
const pinggy = spawn('ssh', ['-p', '443', '-R0:localhost:8080', '-o', 'StrictHostKeyChecking=no', 'a.pinggy.io']);

let urlFound = false;

const processOutput = async (data) => {
    const output = data.toString();
    const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.run\.pinggy-free\.link/);
    if (match && !urlFound) {
        urlFound = true;
        const tunnelUrl = match[0];
        console.log(`\nTunnel established securely at: ${tunnelUrl}`);

        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({
                phoneNumber: process.env.TWILIO_PHONE_NUMBER
            });

            if (incomingPhoneNumbers.length > 0) {
                const phoneNumberSid = incomingPhoneNumbers[0].sid;
                await client.incomingPhoneNumbers(phoneNumberSid).update({
                    voiceUrl: `${tunnelUrl}/incoming-call`,
                    voiceMethod: 'POST'
                });
                console.log(`✅ SUCCESS! Twilio webhook updated to ${tunnelUrl}/incoming-call`);
                console.log(`📞 READY! You can now call the Concierge AI at: ${process.env.TWILIO_PHONE_NUMBER}\n`);
            } else {
                console.error('❌ Could not find Twilio phone number SID');
            }
        } catch (err) {
            console.error('Error updating Twilio:', err);
        }
    }
};

pinggy.stdout.on('data', processOutput);
pinggy.stderr.on('data', processOutput);

pinggy.on('close', () => {
    console.log('Tunnel closed');
    server.kill();
});

server.on('close', () => {
    pinggy.kill();
});
