const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

class FileService {
    static UploadDocument(req, res) {
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error uploading file', error: err.message });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: 'No file provided' });
            }

            const filesDir = path.join(__dirname, 'files');

            if (!fs.existsSync(filesDir)) {
                fs.mkdirSync(filesDir);
            }

            const targetPath = path.join(filesDir, file.originalname);

            fs.rename(file.path, targetPath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error saving file', error: err.message });
                }

                res.status(200).json({
                    message: 'File uploaded successfully',
                    filePath: file.originalname,
                });
            });
        });
    }
    static DownloadDocument(req, res) {
        const { filename } = req.params;

        const filePath = path.join(__dirname, 'files', filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Error during file download:', err);
                    return res.status(500).json({ message: 'Error downloading the file' });
                }
            });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    }
}
module.exports = FileService;