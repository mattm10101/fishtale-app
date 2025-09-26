import { json } from '@sveltejs/kit';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

// Import the credentials from the .env file
import { 
    GOOGLE_PRIVATE_KEY, 
    GOOGLE_CLIENT_EMAIL, 
    GOOGLE_SPREADSHEET_ID 
} from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    // Get the fish species from the frontend request
    const { species } = await request.json(); 
    if (!species) {
        return json({ success: false, error: 'No species provided' }, { status: 400 });
    }

    try {
        // Authenticate with Google Service Account
        const auth = new GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                // Replace escaped newlines for the private key
                private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: 'https://www.googleapis.com/auth/spreadsheets',
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare the new row of data
        const newRow = [
            `id_${new Date().getTime()}`,    // A unique ID based on timestamp
            new Date().toLocaleDateString(), // Today's date, e.g., 9/26/2025
            species,                         // The fish species, e.g., "Bass"
            '',                              // Placeholder for Notes
            ''                               // Placeholder for PhotoFileName
        ];

        // Append the new row to the 'Sheet1' of your spreadsheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: 'Sheet1!A:E',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [newRow],
            },
        });

        return json({ success: true, message: `${species} added to the log!` });

    } catch (error) {
        console.error('Error adding catch:', error);
        return json({ success: false, error: 'Failed to add catch' }, { status: 500 });
    }
}