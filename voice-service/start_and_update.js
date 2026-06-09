import { spawn } from 'child_process';
import localtunnel from 'localtunnel';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 8080;

console.log('Starting voice-service server...');
const server = spawn('node', ['server.js'], { stdio: 'inherit' });

setTimeout(async () => {
    try {
        console.log('Starting localtunnel...');
        const tunnel = await localtunnel({ port: PORT });
        console.log(`Tunnel established at: ${tunnel.url}`);

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({
            phoneNumber: process.env.TWILIO_PHONE_NUMBER
        });

        if (incomingPhoneNumbers.length > 0) {
            const phoneNumberSid = incomingPhoneNumbers[0].sid;
            await client.incomingPhoneNumbers(phoneNumberSid).update({
                voiceUrl: `${tunnel.url}/incoming-call`,
                voiceMethod: 'POST'
            });
            console.log(`\n✅ SUCCESS! Twilio webhook updated to ${tunnel.url}/incoming-call`);
            console.log(`\n📞 READY! You can now call the Concierge AI at: ${process.env.TWILIO_PHONE_NUMBER}\n`);
        } else {
            console.error('❌ Could not find Twilio phone number SID');
        }

        tunnel.on('close', () => {
            console.log('Tunnel closed');
            server.kill();
        });
    } catch (err) {
        console.error('Error starting tunnel:', err);
        server.kill();
    }
}, 2000);
