const { google } = require('googleapis')
const credentials = require('./drive-config.json')
const scopes = ['https://www.googleapis.com/auth/drive']
const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    scopes
)
const drive = google.drive({ version: 'v3', auth })

var fileMetadata = {
    name: 'backup.json',
    mimeType: 'application/json',
}

drive.files.create(
    {
        resource: fileMetadata,
        media: {
            body: JSON.stringify({ date: new Date().getTime() }),
        },
        fields: 'id',
    },
    (err, file) => {
        if (err) {
            // Handle error
            console.error(err)
        } else {
            console.log('File Id: ', file.data.id)

            drive.permissions.create({
                emailAddress: 'erikportin@gmail.com',
                fileId: file.data.id,
                resource: {
                    emailAddress: 'erikportin@gmail.com',
                    role: 'reader',
                    type: 'user',
                },
            })
        }
    }
)
