import { google } from 'googleapis'

const auth = new google.auth.JWT(
    process.env.DRIVE_API_USER,
    undefined,
    process.env.DRIVE_API_KEY,
    ['https://www.googleapis.com/auth/drive']
)
const drive = google.drive({ version: 'v3', auth })

export async function saveFile(body: string): Promise<string | undefined> {
    const now = new Date().getTime()
    const {
        data: { id },
    } = await drive.files.create({
        requestBody: {
            mimeType: 'application/json',
            name: `backup-${now}.json`,
        },
        media: {
            mimeType: 'text/plain',
            body,
        },
    })

    return id || undefined
}

export async function shareFile(fileId: string): Promise<void> {
    drive.permissions.create({
        fileId,
        requestBody: {
            emailAddress: process.env.MAIL_USER,
            role: 'reader',
            type: 'user',
        },
    })
}
