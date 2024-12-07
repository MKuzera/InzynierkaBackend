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
                    filePath: targetPath,
                });
            });
        });
    }
}
module.exports = FileService;