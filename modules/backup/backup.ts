import { saveFile, shareFile } from './drive'

export async function backup(body: string): Promise<void> {
    const fileId = await saveFile(body)
    if (fileId) {
        shareFile(fileId)
    }
}
